from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UsuarioManager(BaseUserManager):
    def create_user(self, username, email, nome, password=None, **extra_fields):
        if not username:
            raise ValueError("O campo Username (login) é obrigatório.")
        if not email:
            raise ValueError("O campo Email é obrigatório.")

        email = self.normalize_email(email)
        user = self.model(username=username, email=email, nome=nome, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, nome, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser precisa de is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser precisa de is_superuser=True")

        return self.create_user(username, email, nome, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True, db_column="IDUsuario")
    nome = models.CharField(max_length=150, db_column="Nome")
    username = models.CharField(max_length=150, unique=True, db_column="Login")
    email = models.EmailField(unique=True, db_column="Email")
    senha = models.CharField(max_length=128, db_column="Senha")  # armazenamos o hash
    dtinclusao = models.DateTimeField(auto_now_add=True, db_column="DtInclusao")
    dtalteracao = models.DateTimeField(auto_now=True, db_column="DtAlteracao")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "nome"]

    class Meta:
        db_table = "Usuario"

    def __str__(self):
        return self.nome

