#!/usr/bin/python

from SPARQLWrapper import SPARQLWrapper, JSON, XML, N3, RDFXML, CSV 
from rdflib import Graph

#beta
#graph_uri = "http://beta-sparql.glygen.org"
#endpoint_uri = "http://beta-sparql.glygen.org:8880/sparql"


#prd
graph_uri = "http://sparql.glygen.org"
endpoint_uri = "http://sparql.glygen.org:8880/sparql"


sparql = SPARQLWrapper(endpoint_uri)

qs = "SELECT ?gsite_uri FROM <%s> " % (graph_uri)
qs += "WHERE { ?gsite_uri <http://purl.jp/bio/12/glyco/conjugate#has_saccharide> ?glycan_uri . } "

sparql.setQuery(qs)
sparql.setReturnFormat(JSON)
results = sparql.query().convert()
for result in results["results"]["bindings"]:
    print result


