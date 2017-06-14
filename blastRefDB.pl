#!/usr/bin/perl  

use strict;

my $blastFile = $ARGV[0];
my $l;
my $node;
my $value;
my $n;
my @c;

open(A, $blastFile);
while ($l=<A>)
{
    # Eliminamos el punto y coma de las lineas que lo tienen
    $l =~ s/;//g;

    # Cuando una linea contiene "Query" inicializamos las variables
    if ($l =~ /Query= (.*)\n/)
    {
        $node = $1;
        $value = 0;
        $n = 1;
    }

    # Cuando una linea contiene "gi" la procesamos asociada al $node actual
    if ($l =~ /gi\|/)
    {
        # Obtenemos los tokens separados por espacios
        @c = split(' ',$l);

                # Este es el caso si es la primera linea "gi" asociada al $node actual
        if ($value == 0)
        {
            # Penultimo campo
            $value = $c[-2];
        }

        # Si el valor de la linea actual es lo suficientemente grande
        if ($c[-2]/$value > 0.85+(0.02*$n))
        {
            $n++;
            $value = ($value + $c[-2])/2;
            print "$node\thit\t$c[0]\t$c[-2]\t$c[-1]\n";
        }
    }
}
close A;
