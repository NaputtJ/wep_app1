import subprocess
import sys
from app import app, db

try:
    subprocess.run(["./frontend.sh"], check=True)
except subprocess.CalledProcessError as e:
    print(f"failed to build: {e}")
    sys.exit(1)

with app.app_context():
    # db.drop_all()
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
