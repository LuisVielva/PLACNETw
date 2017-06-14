#!/usr/bin/perl  

### contigs.fa:
# >NODE_1_length_6166_cov_38.304737
# TTCTCAAAATCGGTGGAGCTGCATGACAAAGTCATCGGGCATTATCTGAACATAAAACAC
# TATCAATAAGTTGGAGTCATTACCCCCCGGACGAGTGGGAATCCATGGTAGGGATTTTTA
# ............................................................

### mapping.sam:
# HISEQ-MFG:60:hb2ceadxx:2:1101:2431:2212 
# 73      
# NODE_114_length_691967_cov_30.468517    
# 71508   
# 255     
# 100M    
# =       
# 71508   
# 0       
# AACCATCTATAAAATCCTCAATCGGAAAACAACCGCCATGGCGGATCCGTTGATCGCTCATAGAATAAAGACACTGCTGTTCCGTGTTGTAGACATCCAC    
# @@@DFFFFHHHHHJGIJJJJJJJIJIJJJJJIJJIJJJJIJIIGJGHHFDEFDCCACBDDCD@CCDDDD>ACCCACDDDAACCB@?DDDDCDEDDDCCDC    
# AS:i:0  XN:i:0  XM:i:0  XO:i:0  XG:i:0  NM:i:0  MD:Z:100        YT:Z:UP

### SAM Format specifications:
#$c[0]  1   QNAME   Query template/pair NAME
#$c[1]  2   FLAG    bitwise FLAG
#$c[2]  3   RNAME   Reference sequence NAME
#$c[3]  4   POS 1-based leftmost POSition/coordinate of clipped sequence
#$c[4]  5   MAPQ    MAPping Quality (Phred-scaled)
#$c[5]  6   CIAGR   extended CIGAR string
#$c[6]  7   MRNM    Mate Reference sequence NaMe (‘=’ if same as RNAME)
#$c[7]  8   MPOS    1-based Mate POSistion
#$c[8]  9   TLEN    inferred Template LENgth (insert size)
#$c[9]  10  SEQ query SEQuence on the same strand as the reference
#$c[10] 11  QUAL    query QUALity (ASCII-33 gives the Phred base quality)
#$c[11] 12+ OPT variable OPTional fields in the format TAG:VTYPE:VALUE

use strict;

my $samFile = $ARGV[0];
my $contigsFile = $ARGV[1];
my $FLANK = $ARGV[2];
my $MINLENGTH = $ARGV[3];

my $l;
my $k;
my $j;
my $i;
my %length;
my %scaffolds;
my $sum = 0;
my $avg;
my $header;
my @ks;
my @c;

open(CONTIGS, $contigsFile);
while ($l=<CONTIGS>)
{
    chomp $l;
    if($l =~ /^>(.*)/)
    {
        $header = $1;
        $header =~ s/\s//g;
    }
    else
    {
        $length{$header} += length($l);
    }
}
close CONTIGS;


open(SAM, $samFile);
while ($l=<SAM>)
{
    @c = split('\t', $l);
    # Only contigs longer than MINLENGTH
    if ($length{$c[6]} > $MINLENGTH & $length{$c[2]} > $MINLENGTH )
    {
        if (($c[3] <= $FLANK || abs($length{$c[2]}-$c[3]) <= $FLANK) &&
            ($c[7] <= $FLANK || abs($length{$c[6]}-$c[7]) <= $FLANK))
        {
            $scaffolds{$c[2]}{$c[6]}++;
            $scaffolds{$c[6]}{$c[2]}++;
            $sum++;
        }
    }
}
close SAM;

$avg = $sum / (1 + scalar(keys(%scaffolds)));
@ks = keys(%length);
for ($i=0; $i<scalar(@ks); $i++)
{
    for ($j=$i+1; $j<scalar(@ks); $j++)
    {
        # Only scaffold with abundance over 30% of the mean scaffold abundance.
        if ($scaffolds{$ks[$i]}{$ks[$j]} > $avg*0.3)
        {
            print "$ks[$i]\tscaff\t$ks[$j]\t\t\t$scaffolds{$ks[$i]}{$ks[$j]}\n";
        }
    }
}
