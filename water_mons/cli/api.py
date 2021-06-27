import argparse
from water_mons.cli import (
    db_init,
    server
    )


ACTION_DICT  = {
    'db_init': db_init.run,
    'server': server.run
}


def main():
    parser = argparse.ArgumentParser(prog ='water-mons',
                                     description ='water_mons package cli')
    parser.add_argument('--action', type = str,
                        help ='action name')
    args = parser.parse_args()
    ACTION_DICT[args.action]()
    