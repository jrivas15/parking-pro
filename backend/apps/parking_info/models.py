from django.db import models


class ParkingInfo(models.Model):
    name = models.CharField(max_length=100)
    nit = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    additionalInfo = models.TextField(null=True, blank=True)
    includeLogo = models.BooleanField(default=True)
    includeParkingInfo = models.BooleanField(default=True)
    includeFeResolution = models.BooleanField(default=False)
    includeQRCode = models.BooleanField(default=True)
    ticketHeader = models.TextField(null=True, blank=True)
    includeBasicRules = models.BooleanField(default=True)
    ticketFooter = models.TextField(null=True, blank=True)
