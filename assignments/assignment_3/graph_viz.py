import kuzu

def process_graph_data(result):
    """
    TODO: implement the processing function that transforms query result into a format suitable for frontend visualization
    """
    
    

    # print(result)

    graph = result.get_as_networkx(directed=False)
    

    returned_data ={'nodes':[], 'links':[]}
    for node, data in graph.nodes.items():
        nodes_data = {
            "id": node,
            "labels": [data['_label']],
            'properties': {key: data[key] for key in data.keys() 
                           if key != '_label' and key != '_id' and data[key] is not None}
        }
        print(nodes_data)
        returned_data['nodes'].append(nodes_data)
    

    for edge, data in graph.edges.items():
        # if (data['_label'] != "Rating"):
        #     print(edge)
        #     print(data)
        
        edges_data ={
            "source": edge[0],
            "target": edge[1],
            "type" : data['_label']
        }

        
        returned_data['links'].append(edges_data)

    # print(returned_data["nodes"])
    # print(returned_data)
    # returned_data['nodes'] = [{"id": node.id,
    #   "labels": node.labels,
    #   "properties": node.properties} for node in graph.nodes()]
    
    
    # print(returned_data["nodes"])


        # check if graph is empty
    if graph.number_of_nodes() == 0:
        #TODO: handle this
        
        return
    return returned_data
        

    
    # Sample movie graph data with target output structure
    sample_data = {
        "nodes": [
            {
                "id": "Movie_1",
                "labels": ["Movie"], 
                "properties": {"title": "The Matrix", "year": 1999}
            },
            {
                "id": "Person_1",
                "labels": ["Person"],
                "properties": {"name": "Keanu Reeves"}
            },
            {
                "id": "Person_2",
                "labels": ["Person"],
                "properties": {"name": "Laurence Fishburne"}
            },
            {
                "id": "Person_3",
                "labels": ["Person"],
                "properties": {"name": "Carrie-Anne Moss"}
            },
            {
                "id": "Person_4",
                "labels": ["Person"],
                "properties": {"name": "Lana Wachowski", "role": "Director"}
            },
            {
                "id": "Genre_1",
                "labels": ["Genre"],
                "properties": {"name": "Sci-Fi"}
            }
        ],
        "links": [
            {
                "source": "Person_1",
                "target": "Movie_1",
                "type": "ACTED_IN"
            },
            {
                "source": "Person_2",
                "target": "Movie_1",
                "type": "ACTED_IN"
            },
            {
                "source": "Person_3",
                "target": "Movie_1",
                "type": "ACTED_IN"
            },
            {
                "source": "Person_4",
                "target": "Movie_1",
                "type": "DIRECTED"
            },
            {
                "source": "Movie_1",
                "target": "Genre_1",
                "type": "IN_GENRE"
            }
        ]
    }
    
    return sample_data

def construct_query(year=None, operator='>', limit=100):
    # limit = 10000
    return f'MATCH (m:Movie)-[l]-(o) WHERE m.year {operator} {year} RETURN m, l, o LIMIT {limit}'