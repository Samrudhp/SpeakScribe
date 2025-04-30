import requests
import time

ASSEMBLYAI_API_KEY = '02cab1cf342e41e9862b750c33fabb4c'

def transcribe_audio(file_path: str) -> str:
    headers = {'authorization': ASSEMBLYAI_API_KEY} 
    
    with open(file_path,'rb') as f:
        upload_response = requests.post('https://api.assemblyai.com/v2/upload', headers=headers, files={'file':f}
                                        )
        
        audio_url = upload_response.json()['upload_url']
        
        response = requests.post(
            "https://api.assemblyai.com/v2/transcript",
            headers=headers,
            json={"audio_url": audio_url}       
            
        )   
        
        transcript_id = response.json()['id']   
        
        while True:
            polling_response = requests.get(
                f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
                headers=headers
            )
            
            if polling_response.json()['status'] == 'completed':
                return polling_response.json()['text']
            elif polling_response.json()['status'] == 'failed':   
                raise Exception("Transcription failed", polling_response.json()['error'])
            time.sleep(3) 
    