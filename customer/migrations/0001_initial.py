# Generated by Django 3.1.2 on 2020-12-13 16:40

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('customerid', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('cfname', models.CharField(max_length=100, null=True)),
                ('clname', models.CharField(max_length=100, null=True)),
                ('cphone', models.CharField(max_length=100, null=True)),
                ('cemail', models.CharField(max_length=100, null=True)),
            ],
            options={
                'db_table': 'customer',
                'managed': False,
            },
        ),
    ]
