import subprocess
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object("config")

try:
    result = subprocess.run(["./db_setup.sh"], check=True)
except subprocess.CalledProcessError as e:
    print(f"failed to setup db: {e}")
    sys.exit(1)

db = SQLAlchemy(app)

from app import view
