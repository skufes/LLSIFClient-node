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

DEPENDENT_PATH = "./dep"
TEMP_PATH = "./temp/"
EXTERNAL_PATH = "./runtime/external"


def resolve_exec_name(filename):
    return "%s%s" % (filename, ".exe" if os.name == "nt" else "")

class SIFDecrypter:
    def __init__(self):
        self.args = self.init_arg_parser()

    def init_arg_parser(self):
        parser = argparse.ArgumentParser(description="Decode a directory of game resources and copy it to external path.")
        parser.add_argument("--dependent-path", metavar="PATH", default=DEPENDENT_PATH)
        parser.add_argument("--temp-path", metavar="PATH", default=TEMP_PATH, required=True)
        parser.add_argument("--external-path", metavar="PATH", default=EXTERNAL_PATH)
        parser.add_argument("--db-decrypt-keys", metavar="JSON", type=json.loads)
        return parser.parse_args()

    def resolve_exec_name(self, filename):
        dependent_path = self.args.dependent_path
        exec_name = resolve_exec_name(filename)
        realpath = os.path.realpath(os.path.join(dependent_path, exec_name))
        if not os.path.exists(realpath):
            raise FileNotFoundError(realpath)
        return realpath

    def decrypt_texture(self, filepath):
        subprocess.call([self.resolve_exec_name("Itsudemo"), "-i", filepath])

    def decrypt_json(self, filepath):
        subprocess.call([self.resolve_exec_name("jbcc-dump"), "-o", filepath, filepath])

    def decrypt_file(self, filepath):
        if os.path.getsize(filepath) > 0:
            subprocess.call([self.resolve_exec_name("HonokaMiku"), filepath])
            _root, _ext = os.path.splitext(filepath)
            if _ext == ".texb":
                self.decrypt_texture(filepath)
                os.remove(filepath)
            elif _ext == ".imag":
                os.remove(filepath)
            elif _ext == ".json":
                self.decrypt_json(filepath)
            elif _ext == ".db_":
                try:
                    dbdecrypt.decrypt(filepath, self.args.db_decrypt_keys)
                except Exception as e:
                    print("Catch error: ", e, file=sys.stderr)
            elif _ext == ".lua":
                pass
            elif _ext == ".png":
                pass
            else:
                pass
        else:
            os.remove(filepath)

    def decrypt(self):
        '''
        Main decode function
        '''
        #decrypter = SIFDecrypter()
        temp_path = self.args.temp_path
        external_path = self.args.external_path
        for root, dirs, paths in os.walk(temp_path):
            rel_path = os.path.relpath(root, temp_path)
            for _path in paths:
                self.decrypt_file(os.path.realpath(os.path.join(root, _path)))
                pass
        if not os.path.exists(external_path):
            os.mkdir(external_path)
        for root, dirs, paths in os.walk(temp_path):
            # make corresponding dirs
            rel_path = os.path.relpath(root, temp_path)
            for _dir in dirs:
                external_dir = os.path.join(external_path, rel_path, _dir)
                if not os.path.exists(external_dir):
                    os.mkdir(external_dir)
            for _path in paths:
                src_path = os.path.join(temp_path, rel_path, _path)
                dest_path = os.path.join(external_path, rel_path, _path)
                shutil.copy2(src_path, dest_path)
        shutil.rmtree(temp_path)

if __name__ == "__main__":
    decrypter = SIFDecrypter()
    decrypter.decrypt()
    pass
