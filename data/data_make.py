# -*- coding: utf-8 -*-
"""
Created on Thu Mar 30 00:26:40 2023

@author: 12861
"""

import pandas as pd 
import numpy as np 
import os
files = [f for f in os.listdir('./') if f.endswith('.csv')]

def min_max_normalize(arr):
    arr_min = min(arr)
    arr_max = max(arr)
    if(abs(arr_max - arr_min) <= 0.000001):
        return [1 for x in arr]
    return [(x - arr_min) / (arr_max - arr_min) for x in arr]
    

def Process(file):
    data=pd.read_csv(file)
    print("Starting process: "+file+"\n")
    
    name_split = [0]
    for i in range(1, data.shape[0]):
        if(data.iloc[i, 0] == data.iloc[i-1, 0]):
            continue
        name_split.append(i)
    name_split.append(data.shape[0])
    
    # print(data.iloc[0, 0], data.iloc[name_split[1],0])
    
    data_list = {}
    
    if(1000 < len(name_split)):
        data_list[data.iloc[:,0].name] = data.iloc[0:name_split[1000],0].tolist()
        data_list[data.iloc[:,1].name] = data.iloc[0:name_split[1000],1].tolist()
    else:
        data_list[data.iloc[:,0].name] = data.iloc[:,0].tolist()
        data_list[data.iloc[:,1].name] = data.iloc[:,1].tolist()
    
    for i in range(2,data.shape[1]):
        try:
            a = []
            b = []
            c = []
            for j in range(min(1000, len(name_split)-1)):
                col=data.iloc[name_split[j]:name_split[j+1],i]
                title=col.name
                normed_data=min_max_normalize(col.tolist())
           
                a+=normed_data
                b+=list(-col)
                c+=list(-np.array(normed_data))
            if(1000 < len(name_split)):
                data_list[title] = data.iloc[0:name_split[1000],i].tolist()
            else:
                data_list[title] = data.iloc[:,i].tolist()
            data_list[title+'-norm'] = a
            data_list[title+'-mir'] = b
            data_list[title+'-mir-norm'] = c
        except TypeError:
            continue
    
#    for key in data_list:
#        print(key, len(data_list[key]))
    dataframe = pd.DataFrame(data_list)
    dataframe.to_csv(file[:-4]+'-processed.csv', index=False)

for file in files:
    Process(file)
            
# Process("airline.csv")