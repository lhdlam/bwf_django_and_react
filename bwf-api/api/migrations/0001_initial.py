# Generated by Django 4.1.6 on 2023-02-13 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
                ('location', models.CharField(max_length=32)),
                ('description', models.CharField(max_length=256)),
            ],
            options={
                'unique_together': {('name', 'location', 'description')},
            },
        ),
    ]
