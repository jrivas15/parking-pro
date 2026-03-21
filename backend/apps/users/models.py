from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields) :
        if not username:
            raise ValueError('The user field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('admin', "Administrador del sistema")
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(unique=True, max_length=45)
    password = models.CharField(max_length=255)
    fullName = models.CharField(max_length=45)
    imgURL = models.CharField(max_length=255, null=True)
    lastLogin = models.DateTimeField(auto_now=True)
    isActive = models.BooleanField(default=True)

    USERNAME_FIELD = 'username'
    objects = UserManager()

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username