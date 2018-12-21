'''
Decode a directory, and copy it to external path.
'''

import os
import json
import argparse
import subprocess
import shutil
import sys

import dbdecrypt

class SIFDbRefresher:
    def __init__(self):
        self.args = self.init_arg_parser()

    def init_arg_parser(self):
        parser = argparse.ArgumentParser(description="Decode a directory of game resources and copy it to external path.")
        parser.add_argument("--db-decrypt-keys", metavar="JSON", type=json.loads)
        parser.add_argument("--db-directory-path", metavar="PATH")
        return parser.parse_args()

    def refresh(self):
        keys = getattr(self.args, "db_decrypt_keys")
        db_dir = getattr(self.args, "db_directory_path")
        if os.path.exists(db_dir):
            for root, dirs, paths in os.walk(db_dir):
                for _path in paths:
                    if os.path.splitext(_path)[1] == ".db_":
                        db_path = os.path.join(root, _path)
                        dbdecrypt.decrypt(db_path, keys)

if __name__ == "__main__":
    refresher = SIFDbRefresher()
    refresher.refresh()
