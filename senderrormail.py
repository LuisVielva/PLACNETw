!/usr/bin/python

import sys, imaplib, smtplib

def send_email(to, name, msgError):
    FROM = 'placnet.online@gmail.com'
    TO = [to]
    SUBJECT = 'An error has ocurred with your data (' + name + ')'
    TEXT = msgError

    message = """\From: %s\nTo: %s\nSubject: %s\n\n%s""" % (FROM, ", ".join(TO), SUBJECT, TEXT)
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login("placnet.online@gmail.com", "???") PUT THE RIGHT PASSWORD INSTEAD OF ???
        server.sendmail(FROM, TO, message)
        server.close()
    except:
        print "ERROR: failed to send mail"

send_email(sys.argv[1], sys.argv[2], sys.argv[3])
