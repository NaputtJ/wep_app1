import subprocess
import os
from datetime import datetime
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

process = subprocess.Popen(["./frontend.sh"])

try:
    result = subprocess.Popen(["./temp/db_setup.sh"])

    print("db setup: ", result.stdout)
    print("db setup error: ", result.stderr)
except subprocess.CalledProcessError as e:
    print(f"failed to setup db: {e}")

app = Flask(__name__)
CORS(app)

db_file = os.path.join(app.root_path, "./temp/assessments.db")


app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_file}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Assessments(db.Model):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    module_code = db.Column(db.String(20), nullable=False)
    deadline = db.Column(db.String(50), nullable=False)
    desc = db.Column(db.Text, nullable=True)
    status = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Assessments id={self.id}>"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "module_code": self.module_code,
            "deadline": self.deadline,
            "desc": self.desc,
            "status": True if self.status else False,
        }


with app.app_context():
    # db.drop_all()
    db.create_all()


@app.route("/api/assessments")
def get_assessments():
    try:
        assessments = Assessments.query.all()
        print(assessments)
        return {
            "status": True,
            "data": [assessment.serialize() for assessment in assessments],
        }
    except Exception as error:
        print(error)

    return {"status": False, "err": "failed to get assessments"}


@app.route("/api/assessments", methods=["POST"])
def post_assessments():
    body = request.get_json()
    print(body)

    for col in ["title", "module_code"]:
        if col in body.keys():
            if body[col] != "":
                continue

        return {"status": False, "err": f"column {col} is null or ''"}

    try:
        datetime.strptime(body["deadline"], "%d-%m-%Y %H:%M")
    except Exception as error:
        print(error)
        return {"status": False, "err": "invalid date format"}

    status = 0 if not isinstance(body["status"], int) else body["status"]

    try:
        new_assessment = Assessments(
            title=body["title"],
            module_code=body["module_code"],
            deadline=body["deadline"],
            desc=body["desc"],
            status=status,
        )
        db.session.add(new_assessment)
        db.session.commit()
    except Exception as error:
        print(error)
        return {"status": False, "err": "failed to insert into assessments"}

    return {
        "status": True,
    }


@app.route("/api/assessments/<int:id>/edit", methods=["POST"])
def post_edit_assessments(id):
    body = request.get_json()

    for col in ["title", "module_code"]:
        if col in body.keys():
            if body[col] != "":
                continue

        return {"status": False, "err": f"column {col} is null or ''"}

    try:
        datetime.strptime(body["deadline"], "%d-%m-%Y %H:%M")
    except Exception as error:
        print(error)
        return {"status": False, "err": "invalid date format"}

    status = 0 if not isinstance(body["status"], int) else body["status"]

    assessment = Assessments.query.get(id)
    if assessment is None:
        return {"status": False, "err": f"assessment id = {id} don't exist"}

    try:
        assessment.title = body["title"]
        assessment.module_code = body["module_code"]
        assessment.deadline = body["deadline"]
        assessment.desc = body["desc"]
        assessment.status = status
        db.session.commit()
    except Exception as error:
        print(error)
        return {"status": False, "err": "failed to update assessments"}

    return {
        "status": True,
    }


@app.route("/api/assessments/<int:id>", methods=["DELETE"])
def post_delete_assessments(id):
    assessment = Assessments.query.get(id)
    if assessment is None:
        return {"status": False, "err": f"assessment id = {id} don't exist"}

    try:
        db.session.delete(assessment)
        db.session.commit()
    except Exception as error:
        print(error)
        return {"status": False, "err": "failed to delete assessments"}

    return {
        "status": True,
    }


if __name__ == "__main__":
    app.run(debug=True)
