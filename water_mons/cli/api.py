import argparse
  
def main():
  
    parser = argparse.ArgumentParser(prog ='water-mons',
                                     description ='water_mons package cli')
  
    parser.add_argument('--action', type = str,
                        help ='action name')
  
    args = parser.parse_args()
  
    print(args.action)