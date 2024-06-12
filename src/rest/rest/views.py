from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json, logging, os
import pymongo
from django.http import JsonResponse, HttpResponse
from bson import json_util


mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = pymongo.MongoClient(mongo_uri)['test_db']
collection = db.todo
class TodoListView(APIView): 
    
    def get(self, request):
        try:
            todos = list(collection.find({}, {"_id": 0}))
            return JsonResponse(todos, safe=False, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(f"Failed to fetch todos: {str(e)}")
            return HttpResponse(status=500, content=f"Internal Server Error: {str(e)}")

    def post(self, request):
        try:
           
            print("mongo_uri",mongo_uri )
            data = json.loads(request.body)
            result = collection.insert_one(data)
            inserted_id = str(result.inserted_id)
            return JsonResponse({"inserted_id": inserted_id,"data":json.loads(json_util.dumps(data))}, safe=False,status=status.HTTP_201_CREATED)
        except Exception as e:
            logging.error(f"Failed to insert todo: {str(e)}")
            return HttpResponse(status=400, content=f"Bad Request: {str(e)}")
