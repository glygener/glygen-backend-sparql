#!/usr/bin/python

from SPARQLWrapper import SPARQLWrapper, JSON, XML, N3, RDFXML, CSV 
from rdflib import Graph

server = "dev"
#server = "beta"

graph_uri = "http://beta-sparql.glygen.org" if server == "beta" else "http://sparql.glygen.org"
sparql = SPARQLWrapper("http://localhost:8890/sparql")

qs = "SELECT ?gsite_uri FROM <%s> " % (graph_uri)
qs += "WHERE { ?gsite_uri <http://purl.jp/bio/12/glyco/conjugate#has_saccharide> ?glycan_uri . } "

sparql.setQuery(qs)
sparql.setReturnFormat(JSON)
results = sparql.query().convert()
for result in results["results"]["bindings"]:
    print result


