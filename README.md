# PLACNETw

PLACNET is a graph-based tool for reconstruction of plasmids from next generation sequence pair-end datasets. PLACNET graphs contain two types of nodes (assembled contigs and reference genomes) and two types of edges (scaffold links and homology to references). Manual pruning of the graphs is a necessary requirement in PLACNET, but this is difficult for users without solid bioinformatic background. PLACNETw, a web tool based on PLACNET, provides an interactive graphic interface, automates BLAST searches, and extracts the relevant information for decision making. It allows a non-trained user to visualize the assembly graphs and related information of contigs as well as reference sequences, so that the pruning operations can be done interactively from a personal computer without the need for additional tools. After pruning, each plasmid becomes a separate connected component subgraph. The resulting data is automatically downloaded by the user.

The script doit is the main bash script that executes to check if a request has been received, checks if everything is correct, performs all the calculations, makes the processed data available to the user, and sends a link to the user when everything is ready to use. The script is executed every minute by crontab with 

* * * * * doit /media/luis/ADATA/cloud/*

The script doit uses the python program fastasplit.py, and the bash script contigInReferenceInfo
