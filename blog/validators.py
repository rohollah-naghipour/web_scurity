from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

import os
import re

@deconstructible
class PostValidator:
    def __init__(self):
        self.allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
        self.image_magic_numbers = {
            b'\xff\xd8\xff': 'JPEG',
            b'\x89PNG': 'PNG',  
            b'GIF8': 'GIF',
            b'RIFF': 'WEBP'
        }
        
        self.title_regex = r'^[a-zA-Z\u0600-\u06FF0-9\s\-\.\,\(\)]{1,15}$'
    
    def __call__(self, data):
        if hasattr(data, 'title') and hasattr(data, 'image'):
            self.validate_title(data.title)
            if data.image:
                self.validate_image(data.image)
        elif isinstance(data, dict):
            self.validate_title(data.get('title', ''))
            if data.get('image'):
                self.validate_image(data['image'])
        else:
            raise ValidationError("Invalid data for validation")
    
    def validate_image(self, image):
        self._validate_file_extension(image)
        self._validate_magic_numbers(image)  
    
    def validate_title(self, title):
        self._validate_title_length(title)
        self._validate_title_pattern(title)
    
    def _validate_file_extension(self, image):
        ext = os.path.splitext(image.name)[1].lower()
        if ext not in self.allowed_extensions:
            raise ValidationError(
                f'Invalid file format. Allowed formats: {", ".join(self.allowed_extensions)}'
            )
    
    def _validate_magic_numbers(self, image):  
        try:
            current_pos = image.tell() if hasattr(image, 'tell') else 0
            
            if hasattr(image, 'seek'):
                image.seek(0)
            
            file_header = image.read(20)
            
            if hasattr(image, 'seek'):
                image.seek(current_pos)
            
            valid_file = False
            for magic_bytes, file_type in self.image_magic_numbers.items():
                if file_header.startswith(magic_bytes):
                    valid_file = True
                    break
            
            if not valid_file:
                raise ValidationError('Invalid image file type')
                
        except Exception as e:
            raise ValidationError(f'Error validating image: {str(e)}')
    
    def _validate_title_length(self, title):
        if len(title.strip()) > 15:
            raise ValidationError('Title cannot be longer than 15 characters')
        if len(title.strip()) == 0:
            raise ValidationError('Title cannot be empty')
    
    def _validate_title_pattern(self, title):
        if not re.match(self.title_regex, title.strip()):
            raise ValidationError(
                'Title can only contain English/Persian letters, numbers, spaces, and - . , ( ) characters'
            )

post_validator = PostValidator()