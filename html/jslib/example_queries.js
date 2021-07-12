var querySet = {
    "1":{
        "title":"Query examples: search by glycan"
        ,"querydict":{
            "1.1":{
                "desc":"Protein enzymes involved in the biosynthesis of glycan G24994OK in mouse"
                ,"qlines":[
                    "SELECT DISTINCT ?protein_uri ?protein_name  "
                    ,"WHERE {"
                    ,"   <http://glygen.org/glycan/G24994OK> glycan:synthesized_by ?rxn . ?rxn gly:has_enzyme_protein ?protein_uri . ?protein_uri up:organism <http://purl.uniprot.org/taxonomy/10090> . optional { ?protein_uri up:recommendedName ?recnameuri . ?recnameuri up:fullName ?protein_name . }"
                    ,"} LIMIT 10000 OFFSET 0"
                ],
            },
            "1.2":{
                "desc":"Glycans synthesized by enzyme protein P42867"
                ,"qlines":[
                    "SELECT DISTINCT ?glycan_uri  "
                    ,"WHERE {"
                    ,"?glycan_uri glycan:synthesized_by ?rxn . ?rxn gly:has_enzyme_protein <http://purl.uniprot.org/uniprot/P42867> . "
                    ,"} LIMIT 10000 OFFSET 0"
                ],
            },
            "1.3":{
                "desc":"Gene locus for enzymes involved in the biosynthesis of glycan G24994OK in mouse"
                ,"qlines":[
                    "SELECT DISTINCT ?gene_name ?gene_locus  "
                    ,"WHERE {"
                    ,"   <http://glygen.org/glycan/G24994OK> glycan:synthesized_by ?rxn . ?rxn gly:has_enzyme_protein ?protein_uri .  ?protein_uri up:encodedBy ?gene_uri . ?gene_uri skos:prefLabel ?gene_name . ?gene_uri gly:hasLocus ?gene_locus . ?protein_uri up:organism <http://purl.uniprot.org/taxonomy/10090> ."
                    ,"} LIMIT 10000 OFFSET 0"
                ],
            }
        }
    },
    "2":{
        "title":"Query examples: search by protein"
        ,"querydict":{
            "2.1":{
                "desc":"Glycoproteins shown to bear G17689DH and which site is this glycan attached to"
                ,"qlines":[
                    "SELECT DISTINCT ?glycoprotein_id  ?pos ?amino_acid"
                    ,"WHERE {"
                    ,"   ?glycoprotein_id gco:glycosylated_at ?site . ?site faldo:location ?loc . ?loc faldo:position ?pos . ?loc glycan:has_amino_acid ?amino_acid . ?site gco:has_saccharide <http://glygen.org/glycan/G17689DH> . "
                    ,"} LIMIT 10000 OFFSET 0"
                ],
            },
            "2.2":{
                "desc":"Glycoproteins reported in mouse"
                ,"qlines":[
                    "SELECT DISTINCT ?isoform_uri "
                    ,"WHERE { "
                    ,"      ?glycoprotein_uri up:sequence ?isoform_uri . ?protein_uri up:sequence ?isoform_uri .  ?protein_uri up:organism <http://purl.uniprot.org/taxonomy/10090> . ?isoform_uri gly:canonical \"true\"^^<http://www.w3.org/2001/XMLSchema#boolean> . "
                    ,"}  LIMIT 10000 OFFSET 0"
                ],
            },
            "2.3":{
                "desc":"Protein functions for protein P14210"
                ,"qlines":[
                    "SELECT DISTINCT \"P14210\" ?protein_function "
                    ,"WHERE {"
                    ,"   <http://purl.uniprot.org/uniprot/P14210> up:annotation ?annuri . ?annuri rdfs:comment ?protein_function . ?annuri rdf:type up:Function_Annotation ."
                    ,"} LIMIT 10000 OFFSET 0"
                ],
            }
        }
    }
}


