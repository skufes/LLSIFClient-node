import os
import shutil
import argparse
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--announcement', action='store_true')
parser.add_argument('-r', '--ranking', action='store_true')
parser.add_argument('-u', '--unix', action='store_true')
parser.add_argument('-w', '--win', action='store_true')
#parser.add_argument('-p', '--prod', action='store_true')
parser.add_argument('-d', '--dev', action='store_true')
args = parser.parse_args()

def createFolderIfNonExist(dirpath):
    if not os.path.exists(dirpath):
        return os.makedirs(dirpath)

createFolderIfNonExist('runtime/')
createFolderIfNonExist('runtime/log')
createFolderIfNonExist('runtime/persist')
createFolderIfNonExist('runtime/external')
createFolderIfNonExist('runtime/database')

subprocess.run(['node', 'src/dbapi/model/keychain'])
subprocess.run(['node', 'src/dbapi/model/package'])

if args.announcement:
    subprocess.run(['node', 'src/dbapi/model/resource'])
    subprocess.run(['node', 'src/dbapi/model/announcement'])

if args.ranking:
    subprocess.run(['node', 'src/dbapi/model/ranking'])

if args.win:
    shutil.copy('config/system/directory.win.json', 'config/system/directory.json')

if args.unix:
    shutil.copy('config/system/directory.unix.json', 'config/system/directory.json')

if args.dev:
    shutil.copy('config/system/environment.dev.json', 'config/system/environment.json')
else:
    shutil.copy('config/system/environment.prod.json', 'config/system/environment.json')
