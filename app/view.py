import os
from app import app, db, models, forms
from flask import request, send_from_directory


@app.route("/api/assessments")
def get_assessments():
    try:
        assessments = models.Assessments.query.all()
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
    form = forms.AssessmentForm()

    if not form.validate_on_submit():
        if form.errors:
            for field, errors in form.errors.items():
                for error in errors:
                    print(f"Error in {getattr(form, field).label.text}: {
                          error}", 'danger')

            return {"status": False, "err": f"validation failed"}

    body = request.get_json()

    try:
        new_assessment = models.Assessments(
            title=body["title"],
            module_code=body["module_code"],
            deadline=body["deadline"],
            desc=body["desc"],
            status=body["status"],
        )
        db.session.add(new_assessment)
        db.session.commit()
    except Exception as error:
        print("Error: ", error)
        return {"status": False, "err": "failed to insert into assessments"}

    return {
        "status": True,
    }


@app.route("/api/assessments/<int:id>/edit", methods=["POST"])
def post_edit_assessments(id):
    form = forms.AssessmentForm()

    if not form.validate_on_submit():
        if form.errors:
            for field, errors in form.errors.items():
                for error in errors:
                    print(f"Error in {getattr(form, field).label.text}: {
                          error}", 'danger')

            return {"status": False, "err": f"validation failed"}

    body = request.get_json()

    assessment = models.Assessments.query.get(id)
    if assessment is None:
        return {"status": False, "err": f"assessment id = {id} don't exist"}

    try:
        assessment.title = body["title"]
        assessment.module_code = body["module_code"]
        assessment.deadline = body["deadline"]
        assessment.desc = body["desc"]
        assessment.status = body["status"]
        db.session.commit()
    except Exception as error:
        print(error)
        return {"status": False, "err": "failed to update assessments"}

    return {
        "status": True,
    }


@app.route("/api/assessments/<int:id>", methods=["DELETE"])
def post_delete_assessments(id):
    assessment = models.Assessments.query.get(id)
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


@app.route('/')
def index():
    return send_from_directory(os.path.join(os.getcwd(), 'frontend/dist/'), 'index.html')


@app.route('/assets/<path:path>')
def assets(path):
    return send_from_directory(os.path.join(os.getcwd(), 'frontend/dist/assets'), path)
