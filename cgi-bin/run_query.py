#!/usr/bin/python
import os,sys
import string
import commands
import csv
import traceback

from Bio import SeqIO
from Bio.Seq import Seq


from optparse import OptionParser
import glob
from bson import json_util, ObjectId
import json
import util
import cgi


import pymongo
from pymongo import MongoClient



__version__="1.0"
__status__ = "Dev"


from SPARQLWrapper import SPARQLWrapper, JSON, XML, N3, RDFXML, CSV 
from rdflib import Graph




def get_triples(endpoint_uri, graph_uri, qs, triple_format):

    sparql = SPARQLWrapper(endpoint_uri)
    sparql.addDefaultGraph(graph_uri)
    sparql.setQuery(qs)

    if triple_format == "N3":
        sparql.setReturnFormat(N3)
        results = sparql.query().convert()
        return results
    elif triple_format == "JSON":
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results
    elif triple_format == "XML":
        sparql.setReturnFormat(XML)
        results = sparql.query().convert()
        return results.toxml()
    elif triple_format == "RDFXML":
        sparql.setReturnFormat(RDFXML)
        results = sparql.query().convert()
        return results.serialize()
    elif triple_format == "CSV":
        sparql.setReturnFormat(CSV)
        results = sparql.query().convert()
        return results
    elif triple_format == "TSV":
        sparql.setReturnFormat(CSV)
        results = sparql.query().convert()
        return results
    else:
        return "bad format!"

    return






###############################
def main():

    global config_json
    global db_obj
    global client
    global path_obj
   
    in_json = json.loads(open("tmp/query.json").read())
    
    out_json = {}
    try:
        config_json = json.loads(open("conf/config.json", "r").read())
        db_obj = config_json[config_json["server"]]["dbinfo"]
        path_obj = config_json[config_json["server"]]["pathinfo"]
        prefixes = ""
        for k in db_obj["nsmap"]:
            prefixes += "PREFIX %s: <%s>\n" % (k, db_obj["nsmap"][k])
        qs = prefixes + " "
        qs += in_json["qs"]
        qs += " LIMIT %s" % db_obj["limit"]
        triples = get_triples(db_obj["endpointuri"], db_obj["graphuri"], qs, in_json["format"])
        out_json = {"taskstatus":1, "errormsg":""}
        out_json["triples"] = triples
    except Exception, e:
        print e
        out_json = {"taskstatus":0, "errormsg":"query failed!"}


    print json.dumps(out_json, indent=4)



if __name__ == '__main__':
	main()

