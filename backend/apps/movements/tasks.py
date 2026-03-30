import os
import time
from celery import shared_task
from django.conf import settings


@shared_task(name='apps.movements.tasks.clean_media_folder')
def clean_media_folder():
    """
    Elimina archivos del directorio media/ que tengan más de 30 días de antigüedad.
    Se ejecuta diariamente a medianoche vía Celery Beat.
    """
    media_root = settings.MEDIA_ROOT
    if not os.path.isdir(media_root):
        return {'deleted': 0, 'errors': 0}

    threshold_ts = time.time() - (10 * 24 * 3600)

    deleted = 0
    errors = 0

    for dirpath, dirnames, filenames in os.walk(media_root, topdown=False):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            try:
                if os.path.getmtime(filepath) < threshold_ts:
                    os.remove(filepath)
                    deleted += 1
            except OSError:
                errors += 1

        # Eliminar directorios vacíos que queden tras el cleanup
        try:
            if dirpath != media_root and not os.listdir(dirpath):
                os.rmdir(dirpath)
        except OSError:
            pass

    return {'deleted': deleted, 'errors': errors}
