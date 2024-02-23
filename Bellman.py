# import copy

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
for cle, valeur in arbre.items():
    if not valeur:
        last_node = cle


# Créer un ensemble de toutes les valeurs des clés
valeurs = set(v for voisins in arbre.values() for v in voisins)

# Trouver la première clé qui n'est pas dans les valeurs
first_node = next(k for k in arbre.keys() if k not in valeurs)





# Reversed dictionary
reversed_arbre = {}

# Iterate through the original dictionary
for key, nested_dict in arbre.items():
    # Iterate through the nested dictionary
    for nested_key, value in nested_dict.items():
        # Check if the value already exists as a key in the reversed dictionary
        if nested_key in reversed_arbre:
            # If it exists, update its nested dictionary with the current key-value pair
            reversed_arbre[nested_key].update({key: value})
        else:
            # If it doesn't exist, create a new nested dictionary with the current key-value pair
            reversed_arbre[nested_key] = {key: value}
reversed_arbre[first_node] = {}







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

# #search the optimal way
# # def optimal_research():

# min_optimal_way = [first_node]
# current_node = first_node
# while current_node != last_node:
#     for key,val in arbre[current_node].items():
#         if min_potentiel[current_node] == val + min_potentiel[key] : 
#             min_optimal_way.append(key)
#             current_node = key

# print("chemin min : ")
# print(min_optimal_way)




##################################################3
print("\n\n max optimal search : ")


# # initialize all potential
# max_potentiel = {k:'-inf' for k,n in arbre.items()}  
# max_potentiel[first_node] = 0
# max_distance = 0
# finished = False
# # arbre_copy = copy.deepcopy(arbre)  # Create a deep copymax_distance = 0
# reversed_arbre_copy = reversed_arbre
# trace = []
# node = [first_node]
# fin = len(arbre)
# step = len(arbre)
# while not finished:    
#     fin -= 1
#     new_node = []
#     for child_node in node:
#         for key,val in arbre[child_node].items():
#             new_node.append(key)
#             new_potential = max_potentiel[child_node] + val
#             if max_potentiel[key] == '-inf':
#                 max_potentiel[key] = new_potential
#             elif max_potentiel[key] < new_potential:
#                 max_potentiel[key] = new_potential
#     node = new_node
#     if fin == 0 :
#         finished = True
# print("potentiel max: ")
# print(max_potentiel)

# #search the optimal way
# # def optimal_research():
# print("here 1")
# max_optimal_way = [last_node]
# print("here 2")

# current_node = last_node
# print("here 3")

# while current_node != first_node:
#     # print("current node : "+current_node + " last node : " +last_node)

#     for key,val in reversed_arbre[current_node].items():
#         if max_potentiel[current_node] == val + max_potentiel[key] : 
#             max_optimal_way.append(key)
#             current_node = key

# print("chemin max : ")
# print(max_optimal_way)



# initialize all potential
max_potentiel = {k:'-inf' for k,n in arbre.items()}  
max_potentiel[last_node] = 0
max_distance = 0
finished = False
# arbre_copy = copy.deepcopy(arbre)  # Create a deep copymax_distance = 0
reversed_arbre_copy = reversed_arbre
trace = []
node = [last_node]
fin = 100
step = len(arbre)
while not finished:    
    fin -= 1
    new_node = []
    for child_node in node:
        for key,val in reversed_arbre[child_node].items():
            new_node.append(key)
            new_potential = max_potentiel[child_node] + val
            if max_potentiel[key] == '-inf':
                max_potentiel[key] = new_potential
            elif max_potentiel[key] < new_potential:
                max_potentiel[key] = new_potential
    node = new_node
    if fin == 0 :
        finished = True
print("potentiel max: ")
print(max_potentiel)

#search the optimal way
# def optimal_research():
print("here 1")
max_optimal_way = [first_node]
print("here 2")

current_node = first_node
print("here 3")

while current_node != last_node:
    # print("current node : "+current_node + " last node : " +last_node)

    for key,val in arbre[current_node].items():
        if max_potentiel[current_node] == val + max_potentiel[key] : 
            max_optimal_way.append(key)
            current_node = key

print("chemin max : ")
print(max_optimal_way)









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

