from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, TextAreaField, DateTimeField, SubmitField
from wtforms.validators import DataRequired, NumberRange, InputRequired, ValidationError


def validate_string(form, field):
    if field in (0, 1):
        raise ValidationError("status must be 0 or 1")


class AssessmentForm(FlaskForm):
    title = StringField("title", validators=[DataRequired()])
    module_code = StringField("module_code", validators=[DataRequired()])
    deadline = DateTimeField(
        "deadline", validators=[DataRequired()], format="%d-%m-%Y %H:%M"
    )
    desc = TextAreaField("desc", validators=[DataRequired()])
    status = IntegerField("status", validators=[validate_string])
