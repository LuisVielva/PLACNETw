#!/usr/bin/python

import sys, imaplib, smtplib

def send_email(to, name, unique):
    url = "https://castillo.dicom.unican.es/ex1?unique=" + unique
    FROM = 'placnet.online@gmail.com'
    TO = [to]
    SUBJECT = 'Your data (' + name + ') is ready to be processed with placnet web'
    TEXT = 'Your data (' + name + ') is ready to be processed with placnet web at ' + url

    message = """\From: %s\nTo: %s\nSubject: %s\n\n%s""" % (FROM, ", ".join(TO), SUBJECT, TEXT)
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.login("placnet.online@gmail.com", "???") # USE THE PASSWORD INSTEAD OF ???
        server.sendmail(FROM, TO, message)
        server.close()
    except:
        print "ERROR: failed to send mail"

send_email(sys.argv[1], sys.argv[2], sys.argv[3])
