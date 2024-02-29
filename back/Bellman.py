from flask import Flask, jsonify , make_response, request
from flask_cors import CORS
import copy

app = Flask(__name__)
# CORS(app) 
cors = CORS(app, origins=["http://localhost:3000"] )
# @app.after_request
# def after_request(response):
#   response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
#   response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#   response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#   return response

# arbre = {
#     'x1': {"x1" : 3,'x2': 10},
#     'x2': {'x4': 8, 'x3': 15},
#     'x3': {'x6': 1, 'x11': 16},
#     'x4': {'x3': 8, 'x5': 6},
#     'x5': {'x9': 1},
#     'x6': {'x5': 5, 'x7': 4},
#     'x7': {'x8': 1, 'x11': 8},
#     'x8': {'x7': 1, 'x10': 2},
#     'x9': {'x8': 3, 'x10': 4},
#     'x10': {'x12': 7},
#     'x11': {'x12': 6, 'x13': 12},
#     'x12': {'x15': 9},
#     'x13': {'x14': 3},
#     'x14': {'x16': 3},
#     'x15': {'x14': 5, 'x16': 6},
#     'x16': {}
# }
@app.route('/get_min_way', methods=['POST', 'OPTIONS'])
def set_arbre():

  arbre = request.get_json() 

  #restructuring tree and adding ({},[])
  new_tree = restructTree(arbre)


  #get first node of tree
  first_node = getFirstNode(new_tree)


  #reverse tree to the algoritme traitement
  reversed_tree = getReversedTree(new_tree,first_node)

  #get last node of tree
  last_node = getLastNode(new_tree,reversed_tree)

#   #get all ways
  all_way = getAllWays(reversed_tree,last_node)
#   data ={
#       'reversedtree' : reversed_tree,
#       'allway' : all_way,
#       'min_optimal_ways' : last_node
#   }
  #recheck all ways
  reCheckedWays = recheckWays(reversed_tree,last_node,all_way)
  
  #affect step possible of each node
  addStepPossibleTree(new_tree,reCheckedWays)

  #get minimum potential and step
  res_min_potential = getAllMinPotential(new_tree,last_node)
  min_potential = res_min_potential['potential']
  min_step = res_min_potential['step']
  min_potentials_at_each_step = res_min_potential['potentials_at_each_step']
  rectify_min_potentialsStep(min_potentials_at_each_step)
#   print(min_potentials_at_each_step)
  #get minimal optimal way
  min_optimal_ways = optimalSearch(new_tree,min_potential,first_node,last_node)


  data ={
      'all_min_potential' : min_potential,
      'min_step' : min_step,
      'min_potentials_at_each_step' : min_potentials_at_each_step,
      'min_optimal_ways' : min_optimal_ways,
  }
  print(data)
  response = make_response(jsonify(success=True))
  response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
  return data
#   return jsonify(success=True)

###############################################################
def rectify_min_potentialsStep(min_potentials_at_each_step):
    for step in min_potentials_at_each_step:
        for node, value in step.items():
            if value == float('inf'):
                step[node] = 'inf'
            if value == float('-inf'):
                step[node] = '-inf'
    del min_potentials_at_each_step[-1]
    return min_potentials_at_each_step


@app.route('/get_max_way', methods=['POST', 'OPTIONS'])
def get_max_way():

  arbre = request.get_json() 

  #restructuring tree and adding ({},[])
  new_tree = restructTree(arbre)

  #get the tree without cycle
  not_cycle_tree = updateTreeCycleDeleted(new_tree)



  #get first node of tree
  first_node = getFirstNode(not_cycle_tree)


  #reverse tree to the algoritme traitement
  reversed_tree = getReversedTree(not_cycle_tree,first_node)

  #get last node of tree
  last_node = getLastNode(not_cycle_tree,reversed_tree)

#   #get all ways
  all_way = getAllWays(reversed_tree,last_node)

  #recheck all ways
  reCheckedWays = recheckWays(reversed_tree,last_node,all_way)
  
  #affect step possible of each node
  addStepPossibleTree(not_cycle_tree,reCheckedWays)

  #get max optimal potential
  res_max_potential = getAllMaxPotential(not_cycle_tree,last_node)
  max_potential = res_max_potential['potential']
  max_step = res_max_potential['step']
  max_potentials_at_each_step = res_max_potential['potentials_at_each_step']
  rectify_min_potentialsStep(max_potentials_at_each_step)
  #get maximal optimal way
  max_optimal_ways = optimalSearch(not_cycle_tree,max_potential,first_node,last_node)

  data ={
      'all_max_potential' : max_potential,
      'max_step' : max_step,
      'max_optimal_ways' : max_optimal_ways,
      'max_potentials_at_each_step' : max_potentials_at_each_step
  }
  print(data)
  response = make_response(jsonify(success=True))
  response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
  return data
#   return jsonify(success=True)





def restructTree(tree):
    new_tree = copy.deepcopy(tree)
    for key in new_tree:
        new_tree[key] = (new_tree[key], [])
    return new_tree





# arbre = {
#     'A': {'B': 5,'C' : 9, 'D' : 4},
#     'B': {'E': 3, 'F': 2},
#     'C': {'D': 4, 'F': 1},
#     'D': {'G': 7},
#     'E': {'I': 9, 'J' : 2, 'K' : 4},
#     'F': {'I': 9, 'G': 3, 'H' : 5},
#     'G': {'H': 7, 'M': 5},
#     'H': {'N': 2},
#     'I': {'J': 9, 'L': 5, 'N' : 1},
#     'J': {'K': 3, 'L' : 10},
#     'K': {'O': 5},
#     'L': {'N': 3, 'O' : 4},
#     'M': {'N': 4, 'P' : 3},
#     'N': {'P': 4},
#     'O': {'P': 9},
#     'P': {}
# }
def getLastNode(tree, reversed_tree):
    last_node = None
    for cle, (valeur,_) in tree.items():
        if not valeur and cle in reversed_tree:
            last_node = cle
    return last_node

def getFirstNode(tree):
    return next(iter(tree))

# Créer un ensemble de toutes les valeurs des clés
# valeurs = set(v for voisins in arbre.values() for v in voisins)
# all_values = [v[0] for v in arbre.values()]

# # Créer un ensemble à partir de cette liste
# valeurs = set()
# for val in all_values:
#     valeurs.update(val)

# Trouver la première clé qui n'est pas dans les valeurs


# Reversed dictionary
def getReversedTree(tree,first):
    reversed_arbre = {}

    # Parcourir les éléments du dictionnaire original
    for key, (nested_dict, _) in tree.items():
        # Parcourir le dictionnaire imbriqué
        for nested_key, value in nested_dict.items():
            # Vérifier si la valeur existe déjà comme clé dans le dictionnaire inversé
            if nested_key in reversed_arbre:
                # Si elle existe, mettre à jour son dictionnaire imbriqué avec la paire clé-valeur actuelle
                reversed_arbre[nested_key].update({key: value})
            else:
                # Si elle n'existe pas, créer un nouveau dictionnaire imbriqué avec la paire clé-valeur actuelle
                reversed_arbre[nested_key] = {key: value}
    reversed_arbre[first] = {}
    return reversed_arbre
    # Assurez-vous que le premier nœud est présent dans le dictionnaire inversé avec une liste vide
# reversed_arbre = getReversedTree(arbre,first)

################################################################################

def getAllMinPotential(tree,last):
    potential = {k: float('inf') for k in tree.keys()}  
    potential[last] = 0
    potentials_at_each_step = [] 
    # potential = copy.deepcopy(potentiel)
    step = 0
    changed = True
    # while step < len(tree) :
    while changed :
        changed = False
        
        for parent_node,(child,s) in tree.items():
        #    if step in s:               
                for child_node,val in child.items():
                    new_pot = potential[child_node] + val
                    if potential[child_node] != "inf" and new_pot < potential[parent_node]:
                        potential[parent_node] = new_pot
                        changed = True
        potentials_at_each_step.append(copy.deepcopy(potential))  # Ajouter les valeurs de potentiel à cette étape
        step += 1
    return {'step' : step -1,'potential' :potential, 'potentials_at_each_step' : potentials_at_each_step}
################################################################################


def getAllMaxPotential(tree,last):
    potential = {k: float('-inf') for k in tree.keys()}  
    potential[last] = 0
    potentials_at_each_step = []
    step = 1
    changed = True
    # while step < max(tree[first_node][1]) :
    while changed:
        changed  =False
        for parent_node,(child,s) in tree.items():
           if step in s:               
                for child_node,val in child.items():
                    new_pot = potential[child_node] + val
                    if potential[child_node] != "-inf" and new_pot > potential[parent_node]:
                        potential[parent_node] = new_pot
                        changed = True
        potentials_at_each_step.append(copy.deepcopy(potential))  # Ajouter les valeurs de potentiel à cette étape
        step += 1
    return {'potential' : potential, 'step' :step -1 , 'potentials_at_each_step' : potentials_at_each_step}

#################################################################
#search the optimal way
# def optimalSearch(tree,min_potential,first,last):
#     optimal_way = []
#     optimal_way.append(first)
#     current_node = first
#     while current_node != last:
#         for key,val in tree[current_node][0].items():
#             next_potentiel = val + min_potential[key]
#             if min_potential[current_node] == next_potentiel and key not in optimal_way : 
#                 optimal_way.append(key)
#                 current_node = key
#     return optimal_way
def optimalSearch(tree, min_potential, first, last):
    optimal_ways = []

    def dfs(current_node, path):
        if current_node == last:
            optimal_ways.append(path[:])
            return
        for key, val in tree[current_node][0].items():
            if val != "inf" and val != "-inf":
                next_potential = val + min_potential[key]
                if min_potential[current_node] == next_potential and key not in path:
                    path.append(key)
                    dfs(key, path)
                    path.pop()

    dfs(first, [first])
    return optimal_ways

##################################################3


####################################### get all ways ###########################################
def getAllWays(reversed_tree, first):
    node = [first] 
    way = {first : [[first]]}
    
    for step in range(1, len(reversed_tree)):
        new_node = []
        for parent_node in node:
            if parent_node in reversed_tree:
                for child_node in reversed_tree[parent_node].keys():
                    
                    # Vérifier s'il y a un cycle
                    if child_node not in way or parent_node not in way[child_node][-1]: 
                        new_node.append(child_node)
                        if child_node not in way:
                            way[child_node] = []
                        for path in way[parent_node]:
                            new_path = path.copy()
                            if child_node not in new_path:
                                new_path.append(child_node)
                            if new_path not in way[child_node] and new_path[-1] == child_node:
                                way[child_node].append(new_path)
        
        node = new_node

    return way
################################################################################


def recheckWays(reversed_tree, first,paths):
    ways = copy.deepcopy(paths)
    node = [first] 
    way = {first : [[first]]}
    
    for step in range(1, len(reversed_tree)):
        new_node = []
        for parent_node in node:
            if parent_node in reversed_tree:
                for child_node in reversed_tree[parent_node].keys():          
                    new_node.append(child_node)
                    for path in ways[parent_node]:
                        new_path = path.copy()
                        if child_node not in new_path:
                            new_path.append(child_node)
                        if new_path not in ways[child_node] and new_path[-1] == child_node:
                            ways[child_node].append(new_path)
        
        node = new_node

    return ways
################################################################################


def print_way(way):
    for key, paths in way.items():
        print(key, ": ")
        for path  in paths:
            print(path)
        print()  # Ajoute une ligne vide après chaque clé

# print_way(way)
##########################################################################################################################
def updateTreeCycleDeleted(tree):
#   new_tree = tree.copy()
  new_tree = copy.deepcopy(tree)
  for node, (children,_) in tree.items():
      for child_node,weight in tree[node][0].items():
        #   if child_node == node :
        #       del children[node]
        #   else:
              
            if node in new_tree[child_node][0].keys() and new_tree[node][0] == tree[node][0]:   #check if already deleted
                weight_other = new_tree[child_node][0][node]
                if weight_other < weight :
                    if node in new_tree[child_node][0]:
                        del new_tree[child_node][0][node]
                elif weight_other > weight:
                    if child_node in new_tree[node][0]:
                        del new_tree[node][0][child_node]
                else :
                    if node in new_tree[child_node][0]:
                        del new_tree[child_node][0][node]

  return new_tree

################################################################################


def addStepPossibleTree(tree, AllPaths):
  
  for node, path_list in AllPaths.items():
    for path in path_list:
      
      path_length = len(path) -1
          
      if path_length not in tree[node][1]:
            tree[node][1].append(path_length)

################################################################################

def print_tree(tree):
    for key, (value,step) in tree.items():
        print(f"{key}: ({value},{step})")
        print()  # Ajoute une ligne vide après chaque clé
  
# paths = getAllWays(reversed_arbre, last_node)
  
# recheckWay = recheckWays(reversed_arbre,last_node,paths)    
# addPathsTree(arbre, recheckWay)

################################################################################
# initialize all potential


#########################################################################

# res_min_potential_search = getAllMinPotential(arbre)
# step = res_min_potential_search['step']
# min_potentiel = res_min_potential_search['potential']
# print(min_potentiel)
# print(step)
# min_optimal_way = optimalSearch(arbre,min_potentiel,first_node,last_node)
# print("chemin min : ")
# for way in min_optimal_way:
#     print(way)


# max_arbre = updateTreeCycleDeleted(arbre)


# res_max_potential_search = getAllMaxPotential(max_arbre)
# step_max = res_max_potential_search['step']
# max_potentiel = res_max_potential_search['potential']
# max_optimal_way = optimalSearch(max_arbre,max_potentiel,first_node,last_node)

# print_tree(max_arbre)
# print(max_potentiel)
# print(step_max)
# for way in max_optimal_way:
#     print(way)



@app.route('/get_min_potential')
def get_min_potential():
  res = getAllMinPotential(arbre)
  min_potential = res['potential']
  min_optimal_path = optimalSearch(arbre, min_potential, first_node, last_node)
  data = {
    'potential': min_potential, 
    'optimal_path': min_optimal_path
  }
  print(jsonify(data))
  return jsonify(data)

@app.route('/get_max_potential')  
def get_max_potential():
  max_arbre = updateTreeCycleDeleted(arbre)
  
  res = getAllMaxPotential(max_arbre)
  max_potential = res['potential']
  max_optimal_path = optimalSearch(max_arbre, max_potential, first_node, last_node)

  return jsonify({
    'potential': max_potential,
    'optimal_path': max_optimal_path 
  })
  
if __name__ == '__main__':
  app.run()
