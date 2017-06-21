Pendiente:
==========
 
- Hacer unos unique mas largos y mejores

- Ver para que utilizar "cut"

- Podriamos poner los nodos en una capa superior a los enlaces, porque al hacer undo pueden taparlos

- ¿Funciona mal el dividir un nodo divido?

- Poner como pagina por defecto el request y con un enlace a un ejemplo ?unique=rj45

- Descargar de mega.nz

- ¿Cambiar los id de los nodos por NODE_xx y NZ_xxx en lugar de todo lo que pone ahora? Implicaciones sobre clone

- Compatibilidad entre navegadores

Amparo vs biomath tmpfs:
========================

velveth: 1:30      1:17
velvetg: 4:40      3:45
todo:    9:30      8:55

todo biomath: 9:57, 9:52, 9:46 (1199), 9:53 (1259), 9:46 (1214), 10:00 (1267), 9:49 (1248), 9:48 (1239), 9:52 (1233),
9:50 (1251) 9:55 (1272) 9:51 (1260) 9:59 (1257) 9:47 (1264) 

todo biomath (rendimiento): 8:44 (1259) 8:38 (1245) 8:37 ¿9:48? 8:30 8:37 8:43
8:52 8:36 8:41 8:34 8:35

todo amparo:  8:36, 8:32 (1244), 8:34 (1201), 8:37 (1237), 8:32 (1193)

Amparo -create_binary:
======================

1:26	4:03	6:34

Optimizando Velvet:
===================

- https://cartaslinux.wordpress.com/2013/04/13/escribe-tu-propio-gestor-de-la-frecuencia-de-la-cpu
(indicator-cpufr)

- Definir OMP_NUM_THREADS y OMP_THREAD_LIMIT para Velvet

- http://askubuntu.com/questions/150260/ssd-tweaks-for-ubuntu-12-04

- Estudiar OpenMP (Velvet parece utilizarlo parcialmente tambien)

- Estudiar el comportamiento de velvet optimizer con la longitud del kmero para optimizar mejor

- Los ficheros "Sequences" de todos los directorios auto_data_xxx parecen ser iguales...

https://thoughtsimproved.wordpress.com/2015/05/18/parellel-processing-in-bash/
http://git.savannah.gnu.org/cgit/parallel.git/tree/README
http://coldattic.info/shvedsky/pro/blogs/a-foo-walks-into-a-bar/posts/7
http://stackoverflow.com/questions/6441509/how-to-write-a-process-pool-bash-shell
http://codecapsule.com/2014/02/12/coding-for-ssds-part-5-access-patterns-and-system-optimizations/

6, 99, VelvetOpt::Assembly=HASH(0x29c1218)->toStringNoV(): 478 478 1189757
4, 91, VelvetOpt::Assembly=HASH(0x2a3f240)->toStringNoV(): 129759 129759 4927520
1, 79, VelvetOpt::Assembly=HASH(0x2a573c0)->toStringNoV(): 116620 116620 4926985
3, 87, VelvetOpt::Assembly=HASH(0x29c1638)->toStringNoV(): 129755 129755 4926968
7, 101, VelvetOpt::Assembly=HASH(0x2997010)->toStringNoV(): 0 0 0
2, 83, VelvetOpt::Assembly=HASH(0x2999df0)->toStringNoV(): 122988 122988 4927094
5, 95, VelvetOpt::Assembly=HASH(0x2a3f6c0)->toStringNoV(): 112140 112140 4928228

The best assembly so far is:
********************************************************
Assembly id: 4
Assembly score: 129759
Velveth timestamp: oct 19 2015 23:48:44
Velvetg timestamp: oct 19 2015 23:50:57
Velveth version: 1.2.10
Velvetg version: 1.2.10
Readfile(s): -fastq -create_binary -shortPaired -separate R_1.fastq R_2.fastq
Velveth parameter string: auto_data_91 91 -fastq -create_binary -shortPaired -separate R_1.fastq R_2.fastq
Velvetg parameter string: auto_data_91  -clean yes
Assembly directory: /home/luis/ex1/auto_data_91
Velvet hash value: 91
Roadmap file size: 810612624
Total number of contigs: 165
n50: 129759
length of longest contig: 352099
Total bases in contigs: 4927520
Number of contigs > 1k: 74
Total bases in contigs > 1k: 4894347
**********************************************************


Caracteristicas adicionales: 
============================

http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/

  
Informacion:
============

view-source:https://my.pcloud.com/publink/show?code=XZyOpHZOCM86TSdiK75H41o49qith5415hk
  		        https://api.pcloud.com/getpubzip?code=XZyOpHZOCM86TSdiK75H41o49qith5415hk
  https://p-par4.pcloud.com/cBZRJ52sZGefp1ZZZ5e7md7Z2ZZhbLZkZRqVL90ZY7ZN7Z97ZVXZOkZk7ZsXZUZDkZ5kZzZeXZa7Zg7ZyOpHZgeFMbwXwSCFhKCGfixcfDzPoK7a7/mapping.sam
  https://api.pcloud.com/getpubzip?code=XZyOpHZOCM86TSdiK75H41o49qith5415hk
  grep set_download_link caca.html | grep https | head -1
  
Links value=1 (solidos) o 2 (discontinuos)
Nodes group=1 (DNA) o 2 (referencias)

3  ways to define a JavaScript class:
http://www.phpied.com/3-ways-to-define-a-javascript-class/

En D3 se pueden seleccionar elementos con:
d3.select( '#name' + i )

También se puede seleccionar por:
tag ("div"), class (".awesome"), unique identifier ("#foo"), attribute ("[color=red]"), or containment ("parent child").

Si modificamos propiedades de los elementos de nodes o links y el force está running, se modifica su representacion visual

Nodos replicados, de NODE_n a NODE_m y viceversa, (en el ejemplo inicial, pasamos de 294 nodos y 1258 enlaces a 1098 enlaces)

Montar un USB en raspberry pi:
==============================
sudo -s
ls /dev/sd*
mkdir /mnt/usb
mount -t vfat /dev/sda1 /mnt/usb

Programas a instalar para placnet:
==================================

Velvet: http://www.ebi.ac.uk/~zerbino/velvet/     make ’MAXKMERLENGTH=131’ 'OPENMP=yes' (modificar mejor el makefile)
VelvetOptimiser: https://github.com/tseemann/VelvetOptimiser
BioPerl: https://phyloinformatics.wordpress.com/2015/03/19/install-bioperl-in-mac-os-x-yosemite/
Blast: ftp://ftp.ncbi.nlm.nih.gov/blast/executables/LATEST/
Bowtie: http://bowtie-bio.sourceforge.net/bowtie2/index.shtml
Prodigal: https://github.com/hyattpd/prodigal/releases/

GeneMark (el segundo) http://exon.gatech.edu/GeneMark/license_download.cgi

Componentes conexas:
====================

dfs(node u)
  for each node v connected to u :
    if v is not visited :
      visited[v] = true
      dfs(v)


for each node u:
  if u is not visited :
    visited[u] = true
    connected_component += 1
    dfs(u)
    
Convertir svg a png:
====================

http://stackoverflow.com/questions/24513244/use-librsvg-rsvg-to-convert-svg-images-with-imagemagic

En OsX:
brew doctor
brew update
brew (re)install imagemagick --with-librsvg
rsvg-convert test.svg -o test.png 
