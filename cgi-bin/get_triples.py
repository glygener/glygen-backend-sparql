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
   
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    n = len(results["results"]["bindings"])

    if triple_format == "N3":
        sparql.setReturnFormat(N3)
        results = sparql.query().convert()
        return results, n
    elif triple_format == "JSON":
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results, n
    elif triple_format == "XML":
        sparql.setReturnFormat(XML)
        results = sparql.query().convert()
        return results.toxml(), n
    elif triple_format == "RDFXML":
        sparql.setReturnFormat(RDFXML)
        results = sparql.query().convert()
        return results.serialize(), n
    elif triple_format == "CSV":
        sparql.setReturnFormat(CSV)
        results = sparql.query().convert()
        return results, n
    elif triple_format == "TSV":
        sparql.setReturnFormat(CSV)
        results = sparql.query().convert()
        return results, n
    else:
        return "bad format!", 0

    return






###############################
def main():

    usage = "\n%prog  [options]"
    parser = OptionParser(usage,version="%prog " + __version__)
    msg = "Input JSON text"
    parser.add_option("-j","--injson",action="store",dest="injson",help=msg)

    form_dict = cgi.FieldStorage()
    (options,args) = parser.parse_args()
    local_flag = False
    in_json = {}
    if len(form_dict.keys()) > 0:
        in_json = json.loads(form_dict["injson"].value) if "injson" in form_dict else {}
    else:
        local_flag = True
        for key in ([options.injson]):
            if not (key):
                parser.print_help()
                sys.exit(0)
        in_json = json.loads(options.injson)


    global config_json
    global db_obj
    global client
    global path_obj
    
    print "Content-Type: application/json"
    print   

    #print json.dumps(in_json, indent=4)
    #sys.exit()
    out_json = {}
    try:
        config_json = json.loads(open("conf/config.json", "r").read())
        db_obj = config_json[config_json["server"]]["dbinfo"]
        path_obj = config_json[config_json["server"]]["pathinfo"]
        prefixes = "\n"
        for k in db_obj["nsmap"]:
            prefixes += "PREFIX %s: <%s>\n" % (k, db_obj["nsmap"][k])
        qs = prefixes + " "
        qs += in_json["qs"]
        if in_json["qs"].lower().find(" limit ") == -1:
            qs += " LIMIT %s OFFSET 0" % (db_obj["limit"])
        else:
            q_part = in_json["qs"].split(" limit ")[0]
            if in_json["qs"].find(" limit ") == -1:
                q_part = in_json["qs"].split(" LIMIT ")[0]
            limit_part = in_json["qs"].lower().split(" limit ")[-1]
            limit_value = limit_part.strip().split(" ")[0]
            if limit_value.isnumeric() == True and int(limit_value) > int(db_obj["limit"]):
                qs = prefixes + " " + q_part + " LIMIT %s OFFSET 0" % (db_obj["limit"])
        #print qs
        triples, ntriples = get_triples(db_obj["endpointuri"], db_obj["graphuri"], qs, in_json["format"])
        out_json = {"taskstatus":1, "errormsg":""}
        out_json["triples"] = triples
        out_json["ntriples"] = ntriples

    except Exception, e:
        print e
        out_json = {"taskstatus":0, "errormsg":"query failed!"}

    print json.dumps(out_json, indent=4)



if __name__ == '__main__':
	main()

