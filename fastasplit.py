#!/usr/bin/python

import sys;

Directorio = str(sys.argv[1]) if len(sys.argv) == 2 else "."
contigs = Directorio + "/contigs.fa"

f2 = open("/dev/null", "r")
f = open(contigs, "r")
for line in f:
    # if ">" in line:
    if line[0] == ">":
        filename = Directorio + "/NODE_" + line.split("_")[1] + ".fa"
        f2 = open(filename, "w")
    f2.write(line)

f.close()
