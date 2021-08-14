import os
from setuptools import setup, find_packages

required = [
    'numpy',
    'pandas',
    'pyarrow',
    'yfinance',
    'sqlalchemy',
    'scipy',
    'PyWavelets',
    'Sphinx',
    'rinohtype',
    'nbsphinx',
    'pytest-dependency',
    'scipy',
    'matplotlib',
    'sklearn',
    'joblib'
]

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name='water-mons',
    version='0.0.0',
    description='The platorm for stock management',
    packages=[
        'water_mons',
        'water_mons/cli',
        'water_mons/connection',
        'water_mons/backtest',
        'water_mons/performance',
        'water_mons/flask_blueprint',
        'water_mons/test',
    ],
    license='MIT',
    entry_points={
            'console_scripts': [
                'water-mons = water_mons.cli.api:main'
            ]
    },
    author_email='kuanlun.chiang@outlook.com',
    url='https://github.com/Sci-Inference/WaterMons',
    project_urls={
        'Source Code': 'https://github.com/Sci-Inference/WaterMons',
    },
    keywords=['time series', 'stock', 'data science', 'finance'],
    install_requires=required,
    author='Sci-Inference',
    long_description=long_description,
    long_description_content_type='text/markdown',
    classifiers=[
        'Intended Audience :: Science/Research',
        'Intended Audience :: Developers',
        'Programming Language :: Python',
        'Topic :: Software Development',
        'Topic :: Scientific/Engineering',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
    ],
)
