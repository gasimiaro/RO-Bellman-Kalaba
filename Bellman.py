# import copy

from pickle import TRUE


arbre = {
    'x1': {'x2': 10},
    'x2': {'x4': 8, 'x3': 15},
    'x3': {'x6': 1, 'x11': 16},
    'x4': {'x3': 8, 'x5': 6},
    'x5': {'x9': 1},
    'x6': {'x5': 5, 'x7': 4},
    'x7': {'x8': 1, 'x11': 8},
    'x8': {'x7': 1, 'x10': 2},
    'x9': {'x8': 3, 'x10': 4},
    'x10': {'x12': 7},
    'x11': {'x12': 6, 'x13': 12},
    'x12': {'x15': 9},
    'x13': {'x14': 3},
    'x14': {'x16': 3},
    'x15': {'x14': 5, 'x16': 6},
    'x16': {}
}
for key in arbre:
    arbre[key] = (arbre[key], [])  # Ajoute une liste vide à chaque valeur

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

last_node = None
for cle, (valeur,_) in arbre.items():
    if not valeur:
        last_node = cle

# Créer un ensemble de toutes les valeurs des clés
# valeurs = set(v for voisins in arbre.values() for v in voisins)
all_values = [v[0] for v in arbre.values()]

# Créer un ensemble à partir de cette liste
valeurs = set()
for val in all_values:
    valeurs.update(val)

# Trouver la première clé qui n'est pas dans les valeurs
first_node = next(k for k in arbre.keys() if k not in valeurs)
# print(first_node)





# Reversed dictionary
# reversed_arbre = {}

# # Iterate through the original dictionary
# for key, nested_dict in arbre.items():
#     # Iterate through the nested dictionary
#     for nested_key, value in nested_dict.items():
#         # Check if the value already exists as a key in the reversed dictionary
#         if nested_key in reversed_arbre:
#             # If it exists, update its nested dictionary with the current key-value pair
#             reversed_arbre[nested_key].update({key: value})
#         else:
#             # If it doesn't exist, create a new nested dictionary with the current key-value pair
#             reversed_arbre[nested_key] = {key: value}
# reversed_arbre[first_node] = {}
reversed_arbre = {}

# Parcourir les éléments du dictionnaire original
for key, (nested_dict, _) in arbre.items():
    # Parcourir le dictionnaire imbriqué
    for nested_key, value in nested_dict.items():
        # Vérifier si la valeur existe déjà comme clé dans le dictionnaire inversé
        if nested_key in reversed_arbre:
            # Si elle existe, mettre à jour son dictionnaire imbriqué avec la paire clé-valeur actuelle
            reversed_arbre[nested_key].update({key: value})
        else:
            # Si elle n'existe pas, créer un nouveau dictionnaire imbriqué avec la paire clé-valeur actuelle
            reversed_arbre[nested_key] = {key: value}

# Assurez-vous que le premier nœud est présent dans le dictionnaire inversé avec une liste vide
first_node = next(iter(arbre))
reversed_arbre[first_node] = {}

# print(reversed_arbre)




# initialize all potential
min_potentiel = {k: float('inf') for k in arbre.keys()}  
min_potentiel[last_node] = 0
# arbre_copy = copy.deepcopy(arbre)  # Create a deep copymax_distance = 0
trace = []
step = 1

def getAllMinPotential(tree,potential):
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
        step += 1
    return step



# # initialize all potential
# min_potentiel = {k:'inf' for k,n in arbre.items()}  
# min_potentiel[last_node] = 0
# max_distance = 0
# finished = False
# # arbre_copy = copy.deepcopy(arbre)  # Create a deep copymax_distance = 0
# reversed_arbre_copy = reversed_arbre
# trace = []
# node = [last_node]
# fin = len(arbre)
# step = len(arbre)
# while not finished:
    
#     fin -= 1
#     new_node = []
#     for child_node in node:
#         for key,val in reversed_arbre_copy[child_node].items():
#             new_node.append(key)
#             new_potential = min_potentiel[child_node] + val
#             if min_potentiel[key] == 'inf':
#                 min_potentiel[key] = new_potential
#             elif min_potentiel[key] > new_potential:
#                 min_potentiel[key] = new_potential
#     node = new_node
#     if fin == 0 :
#         finished = True
# print("potentiel min: ")
# print(min_potentiel)

#search the optimal way
def optimalMinSearch(tree,min_potential,first,last):
    min_optimal_way = [first]
    current_node = first
    while current_node != last:
        for key,val in tree[current_node][0].items():
            if min_potential[current_node] == val + min_potential[key] : 
                min_optimal_way.append(key)
                current_node = key
    return min_optimal_way



##################################################3
# print("\n\n max optimal search : ")


# # initialize all potential
# max_potentiel = {k:'-inf' for k,n in arbre.items()}  
# max_potentiel[last_node] = 0
# print(max_potentiel)
# max_distance = 0
# finished = False
# # arbre_copy = copy.deepcopy(arbre)  # Create a deep copymax_distance = 0
# reversed_arbre_copy = reversed_arbre
# trace = []
# node = [last_node]
# fin = 100
# step = len(arbre)
# while not finished:    
#     fin -= 1
#     new_node = []
#     for child_node in node:
#         for key,val in reversed_arbre[child_node].items():
#             if child_node not in reversed_arbre[key] :   #check if not a cycle
#                 new_node.append(key)
#                 new_potential = max_potentiel[child_node] + val
#                 if max_potentiel[key] == '-inf':
#                     max_potentiel[key] = new_potential
#                 elif max_potentiel[key] < new_potential:
#                     max_potentiel[key] = new_potential
#     node = new_node
#     if fin == 0 :
#         finished = True
# print("potentiel max: ")
# print(max_potentiel)

# #search the optimal way
# # def optimal_research():
# max_optimal_way = [first_node]

# current_node = first_node

# while current_node != last_node:
#     # print("current node : "+current_node + " last node : " +last_node)

#     for key,val in arbre[current_node].items():
#         if max_potentiel[current_node] == val + max_potentiel[key] : 
#             max_optimal_way.append(key)
#             current_node = key

# print("chemin max : ")
# print(max_optimal_way)



####################################### get all ways ###########################################
# def getAllWays(reversed_tree, first_node):
#     node = [first_node]
#     way = {first_node: [[first_node]]}  # Initialiser avec le premier nœud et son propre chemin
#     for step in range(1, 20):
#         new_node = []
#         for parent_node in node:
#             if parent_node in reversed_tree:
#                 for child_node in reversed_tree[parent_node].keys():
#                     if parent_node not in reversed_tree[child_node]:
#                         new_node.append(child_node)
#                         # Ajouter l'étape dans la liste des étapes pour le nœud enfant
#                         if child_node not in way:
#                             way[child_node] = []
#                         for path in way[parent_node]:
#                             new_path = path.copy()
#                             new_path.append(child_node)
#                             # Ajouter le nouveau chemin seulement s'il n'existe pas déjà
#                             if new_path not in way[child_node]:
#                                 way[child_node].append(new_path)
        
#         # Mettre à jour les nœuds visités jusqu'à présent dans le chemin
#         node = new_node

#     return way

# first_node = 'x16'
# way = getAllWays( reversed_arbre, first_node)
# def print_way(way):
#     for key, paths in way.items():
#         print(key, ": ")
#         for path  in paths:
#             print(path)
#         print()  # Ajoute une ligne vide après chaque clé

# print_way(way)

def getAllWays(reversed_tree, first):
    node = [first] 
    way = {first : [[first]]}
    
    for step in range(1, len(arbre)+100):
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
                            if new_path not in way[child_node]:
                                way[child_node].append(new_path)
        
        node = new_node

    return way

# def recheckWays(tree,ways):
#     tip = 1
#     changed = True
#     while changed :
#         changed = False
#         for parent_node,(child,_) in tree.items() :
#             for child_node in child.keys():
#                 for path in ways[child_node] :
#                     # print(path)
#                     # print(path[-1])
#                     # print(child_node)
#                     if path[-1] == child_node:
#                         # if tip == 1:
#                         #     print(path)
#                         path.append(parent_node)
#                         if tip == 2:                        
#                             print(path)
#                         if path not in ways[parent_node] and path[-1] == parent_node:
#                             # print("ampiana1")
#                             # print(ways[parent_node])
#                             # print(path)
#                             ways[parent_node].append(path) 
#                             # print("ampiana2")
#                             # print(ways[parent_node])
#                             changed = True
#             tip +=1

#     return ways
def recheckWays(reversed_tree,ways):
    tip = 1
    changed = True
    while changed :
        changed = False
        for parent_node,child in reversed_tree.items() :
            
                for child_node in child.keys():
                    for path in ways[parent_node] :
                        new_path = path.copy()
                        # print(path)
                        # print(path[-1])
                        # print(child_node)
                        if new_path[-1] == parent_node:
                            # if tip == 1:
                            #     print(path)
                            new_path.append(child_node)
                            # if tip == 2:                        
                            #     print(path)
                            if new_path not in ways[child_node] and new_path[-1] == child_node:
                                # print("ampiana1")
                                # print(ways[parent_node])
                                # print(path)
                                ways[child_node].append(path) 
                                # print("ampiana2")
                                # print(ways[parent_node])
                                changed = True
                tip +=1

    return ways



def print_way(way):
    for key, paths in way.items():
        print(key, ": ")
        for path  in paths:
            print(path)
        print()  # Ajoute une ligne vide après chaque clé

# print_way(way)
##########################################################################################################################

# def addArcStepsWay(tree, reversed_tree, first_node):

#   node = [first_node]

#   for step in range(1, len(tree)+20):

#     new_node = []

#     for parent_node in node:

#       if parent_node in reversed_tree:
        
#         for child_node, _ in reversed_tree[parent_node].items():
          
#           # Vérifier qu'on ne crée pas de cycle  
#           if parent_node not in reversed_tree[child_node]: 

#             new_node.append(child_node)
#             if step not in tree[child_node][1]:
#             # Mettre à jour la liste des étapes pour ce noeud
#                 tree[child_node][1].append(step)

#     node = new_node
# print_way(paths)
# Fonction pour ajouter les longueurs de chemins comme étapes
                
def addStepsFromPaths(tree, AllPaths):

  for node, path_list in AllPaths.items():
    for path in path_list:
      
      path_length = len(path) -1
          
      if path_length not in tree[node][1]:
            tree[node][1].append(path_length)

def print_tree(tree):
    for key, (value,step) in tree.items():
        print(f"{key}: ({value},{step})")
        print()  # Ajoute une ligne vide après chaque clé

# addArcStepsWay(arbre,reversed_arbre,last_node)
# print_tree(arbre)
# print_tree(arbre)   
# way = getAllWays( reversed_arbre, last_node)
        
paths = getAllWays(reversed_arbre, last_node)
# print_way(paths)
# recheckWay = recheckWays(arbre,paths)    
recheckWay = recheckWays(reversed_arbre,paths)    
print_way(recheckWay)    
addStepsFromPaths(arbre, recheckWay)

print_tree(arbre)

################################################################################
# initialize all potential
max_potentiel = {k: float('-inf') for k in arbre.keys()}  
max_potentiel[last_node] = 0
max_distance = len(arbre)
finished = False
# arbre_copy = copy.deepcopy(arbre)  # Create a deep copymax_distance = 0
trace = []
step = 1

def getAllMaxPotential(tree,potential):
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
        step += 1
    return step -1
# step = getAllMinPotential(arbre,min_potentiel)
# print(min_potentiel)
# print(step -1)
# min_optimal_way = optimalMinSearch(arbre,min_potentiel,first_node,last_node)
# print("chemin min : ")
# print(min_optimal_way)


# step_max = getAllMaxPotential(arbre,max_potentiel)
# print(max_potentiel)
# print(step_max)
# start_node = 'x16'
# try:
#     distances = bellman_ford(reversed_arbre, start_node)
#     print("Distances les plus courtes à partir du noeud", start_node, ":")
#     for node, distance in distances.items():
#         print("Vers", node, ":", distance)
# except ValueError as e:
#     print(e)


# print("potentiel max: ")
# print(max_potentiel)

# #search the optimal way
# # def optimal_research():
# max_optimal_way = [first_node]

# current_node = first_node

# while current_node != last_node:
#     # print("current node : "+current_node + " last node : " +last_node)

#     for key,val in arbre[current_node].items():
#         if max_potentiel[current_node] == val + max_potentiel[key] : 
#             max_optimal_way.append(key)
#             current_node = key

# print("chemin max : ")
# print(max_optimal_way)











# while not finished:
#     node = last_node
#     last_choice = ""
#     while node != first_node :
#         for cle, valeur in arbre_copy.items():
#             occ = 0
#             if node in valeur:
#                 max_distance += 1
#                 trace.append(node)
#                 print(node)
#                 print(arbre_copy[cle])
#                 del arbre_copy[cle][node] 
#                 node = cle
#                 break
#     finished = True
# print("Maximum distance:", max_distance)
# print("Trace: ", trace)
# print(arbre_copy)

