from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, ColorClip
from matplotlib.colors import to_rgba
import zipfile
import os
from config import Config
import whisper_timestamped as whisper
import tempfile
import json

def extract_audio_from_video(video_path, audio_path):
    """
    Extracts audio from a video file.
    """
    video_clip = VideoFileClip(video_path)
    video_clip.audio.write_audiofile(audio_path)

def transcribe_audio(audio_path):
    """
    Uses Whisper to transcribe the audio file.
    """
    model = whisper.load_model(Config.WHISPER_MODEL)  # Choose the appropriate model size: 'base', 'small', 'medium', 'large'
    result = whisper.transcribe(model, audio_path)
    print("result: ", json.dumps(result))

    segments = []
    for segment in result['segments']:
        segments.append({
            'segment_start': segment['start'],  # Start time of the segment
            'segment_end': segment['end'],  # End time of the segment
            'text': segment['text'],  # Full text of the segment
            'words': segment["words"],
        })

    return segments

def transcribe_video(video_path):
    """
    Transcribes the given video using Whisper and returns segments with word-level timestamps.
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        audio_path = os.path.join(temp_dir, "audio.wav")
        extract_audio_from_video(video_path, audio_path)
        segments = transcribe_audio(audio_path)
    return segments

def create_text_clip(text, start, end, font_size, font_color, video_size, position, bold=False, background_color=None, background_opacity=1.0, padding=10, margin=55):
    # Text properties
    text_attributes = {
        'fontsize': font_size,
        'color': font_color,
        'font': 'Arial-Bold' if bold else 'Arial'
    }

    text_clip = TextClip(text, **text_attributes)
    text_clip = text_clip.set_start(start).set_duration(end - start)
    
    # Calculate positions and sizes for the text and background
    width, height = video_size
    text_width, text_height = text_clip.size
    padded_text_width = text_width + 2 * padding
    padded_text_height = text_height + 2 * padding

    # Default to center if position is invalid
    pos = ('center', 'center')

    if position == "center":
        pos = ('center', 'center')
    elif position == "top":
        pos = ('center', margin)
    elif position == "bottom":
        pos = ('center', height - padded_text_height - margin)
    elif position == "left":
        pos = (margin, 'center')
    elif position == "right":
        pos = (width - padded_text_width - margin, 'center')
    elif position == "top_left":
        pos = (margin, margin)
    elif position == "top_right":
        pos = (width - padded_text_width - margin, margin)
    elif position == "bottom_left":
        pos = (margin, height - padded_text_height - margin)
    elif position == "bottom_right":
        pos = (width - padded_text_width - margin, height - padded_text_height - margin)

    text_clip = text_clip.set_position(pos)

    if background_color:
        # Convert background_color to RGBA if it is a name or hex string
        if isinstance(background_color, str):
            bg_color_rgba = to_rgba(background_color)
        else:
            bg_color_rgba = background_color

        # Apply opacity
        bg_color_rgba = bg_color_rgba[:3] + (int(background_opacity * 255),)

        # Create a ColorClip for the background with the same size as the text plus padding
        bg_clip = ColorClip(size=(padded_text_width, padded_text_height), color=bg_color_rgba)
        bg_pos = (pos[0] - padding if isinstance(pos[0], (int, float)) else pos[0],
                  pos[1] - padding if isinstance(pos[1], (int, float)) else pos[1])
        bg_clip = bg_clip.set_start(start).set_duration(end - start).set_position(bg_pos)
        return CompositeVideoClip([bg_clip, text_clip], size=video_size)

    return text_clip

def generate_gif_zip(video_id, segments_list, template, output_zip_path):
    gifs_folder = os.path.join(Config.GIF_FOLDER, video_id)
    os.makedirs(gifs_folder, exist_ok=True)

    video_path = os.path.join(Config.UPLOAD_FOLDER, f"{video_id}.mp4")
    video_clip = VideoFileClip(video_path)

    # Extract template properties
    font_color = template.get('font_color', 'white')
    font_size = template.get('font_size', 144)
    position = template.get('position', 'bottom')
    max_words = template.get('max_words', 3)
    fps = template.get('fps', 10)
    bold = template.get('bold', False)
    background_color = template.get('background_color', (0, 0, 0))  # Default to black
    background_opacity = template.get('background_opacity', 1.0)  # Default to fully opaque
    padding = template.get('padding', 10)  # Added padding
    margin = template.get('margin', 55)  # Added margin

    gif_index = 0
    buffer_time = 1.0  # 1000ms buffer

    for segment in segments_list:
        segment_start = segment['segment_start']
        segment_end = segment['segment_end']
        extended_end = segment_end + buffer_time  # Extend segment duration by buffer time
        words = segment['words']
        
        current_start = 0
        current_words = []
        text_clips = []

        for word_info in words:
            word_start = word_info['start']
            word_end = word_info['end']
            word_text = word_info['text']

            # Transform word times to be relative to the segment
            relative_start = word_start - segment_start
            relative_end = word_end - segment_start

            current_words.append(word_text)
            if len(current_words) == max_words or word_info == words[-1]:
                # For the last set of words in the segment, extend to the buffer end
                end_time = extended_end - segment_start if word_info == words[-1] else relative_end
                text_clip = create_text_clip(' '.join(current_words), current_start, end_time, font_size, font_color, video_clip.size, position, bold, background_color, background_opacity, padding, margin)
                text_clips.append(text_clip)
                current_words = []
                current_start = relative_end  # Next clip starts where the previous ended

        # Adjust the subclip duration to include the buffer time
        video_segment = video_clip.subclip(segment_start, extended_end)
        gif_video = CompositeVideoClip([video_segment] + text_clips)

        # Save the GIF
        gif_path = os.path.join(gifs_folder, f"segment_{gif_index:03}.gif")
        gif_video.write_gif(gif_path, fps=fps)
        gif_index += 1

    # Create a zip file with all GIFs
    with zipfile.ZipFile(output_zip_path, 'w') as gif_zip:
        for root, _, files in os.walk(gifs_folder):
            for file in files:
                gif_zip.write(os.path.join(root, file), arcname=file)

    # Cleanup temporary gif files
    # for file in os.listdir(gifs_folder):
    #     os.remove(os.path.join(gifs_folder, file))
    # os.rmdir(gifs_folder)

if __name__ == '__main__':
    video_id = '2bea7889-a794-413f-859a-4e6c721989f4'
    segments_list = [
        {
            "segment_end": 1.38,
            "segment_start": 0.0,
            "text": " I love you.",
            "words": [
                {
                    "confidence": 0.827,
                    "end": 0.82,
                    "start": 0.0,
                    "text": "I"
                },
                {
                    "confidence": 0.952,
                    "end": 1.06,
                    "start": 0.82,
                    "text": "love"
                },
                {
                    "confidence": 0.993,
                    "end": 1.38,
                    "start": 1.06,
                    "text": "you."
                }
            ]
        }
    ]
    template = {
        "font_color": "yellow",
        "font_size": 144,
        "position": "bottom",
        "bold": True,
        "background_color": "#000000",  # Black background color
        "background_opacity": 0.5,  # 50% opacity
        "padding": 34,
        "margin": 8,
        "max_words": 3,
        "fps": 10
    }
    # segments = transcribe_video("/Users/navpreetsinghdevpuri/Downloads/output1.mp4")
    gif_zip_path = os.path.join(Config.GIF_FOLDER, f"{video_id}.zip")
    generate_gif_zip(video_id, segments_list, template, gif_zip_path)
