from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, TextAreaField, DateTimeField
from wtforms.validators import DataRequired, ValidationError


def validate_int(_form, field):
    """custom integer valadation"""
    if field in (0, 1):
        raise ValidationError("status must be 0 or 1")


class AssessmentForm(FlaskForm):
    """Assessment Form"""
    title = StringField("title", validators=[DataRequired()])
    module_code = StringField("module_code", validators=[DataRequired()])
    deadline = DateTimeField(
        "deadline", validators=[DataRequired()], format="%d-%m-%Y %H:%M"
    )
    desc = TextAreaField("desc", validators=[DataRequired()])
    status = IntegerField("status", validators=[validate_int])
