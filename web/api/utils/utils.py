import string
import uuid

import os

debug_counter = 0x10


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    global debug_counter
    if os.environ.get('DEBUG'):
        new_id = uuid.UUID(int=debug_counter)
        debug_counter += 1
    else:
        new_id = uuid.uuid4()

    return new_id
