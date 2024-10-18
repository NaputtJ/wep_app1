import os

basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + \
    os.path.join(basedir, './temp/assessments.db')
SQLALCHEMY_TRACK_MODIFICATIONS = True
WTF_CSRF_ENABLED = False
# SECRET_KEY = 'a-very-secret-secret'
