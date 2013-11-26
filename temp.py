[{"depend": ["authn"], "id": "authn-assertion_id_request", "descr": "AuthnRequest followed by an AssertionIDRequest",
  "name": "AuthnRequest and then an AssertionIDRequest"},
 {"depend": ["authn"], "id": "authn-nid_no", "descr": "AuthnRequest using HTTP-redirect",
  "name": "Basic SAML2 AuthnRequest, no name ID format specified"},
 {"depend": ["authn"], "id": "nameid-mapping", "name": "Simple NameIDMapping request"},
 {"depend": ["authn"], "id": "authn-with-name_id_policy", "descr": "AuthnRequest with specific NameIDPolicy",
  "name": "SAML2 AuthnRequest with specific NameIDPolicy"},
 {"depend": ["authn"], "id": "authn-authn_query", "descr": "AuthnRequest followed by an AuthnQuery",
  "name": "AuthnRequest and then an AuthnQuery"},
 {"depend": ["authn"], "id": "authn-nid_email", "descr": "AuthnRequest using HTTP-redirect",
  "name": "Basic SAML2 AuthnRequest, email name ID"},

 {"id": "verify", "descr": "Uses AuthnRequest to check connectivity", "name": "Verify connectivity"},

 {"depend": ["authn"], "id": "manage_nameid", "name": "Setting the SP provided ID by using ManageNameID"},

 {"id": "ecp_authn", "descr": "SAML2 AuthnRequest using ECP and PAOS", "name": "SAML2 AuthnRequest using ECP and PAOS"},

 {"depend": ["verify"], "id": "authn", "descr": "AuthnRequest using HTTP-redirect",
  "name": "Absolute basic SAML2 AuthnRequest"},
 {"depend": ["authn"], "id": "authn_endpoint_index-transient", "descr": "", "name": ""},
 {"depend": ["authn"], "id": "authn-with-name_id_policy_nid-transient",
  "descr": "AuthnRequest with specific NameIDPolicy", "name": "SAML2 AuthnRequest with specific NameIDPolicy"},

 {"id": "authn-artifact", "descr": "AuthnRequest using HTTP-redirect and artifact",
  "name": "SAML2 AuthnRequest using an artifact"}, {"depend": ["authn"], "id": "attribute-query", "name": ""},

 {"depend": ["authn"], "id": "attribute-query-transient", "name": ""},
 {"depend": ["authn"], "id": "authn-nid_transient-assertion_id_request",
  "descr": "AuthnRequest followed by an AssertionIDRequest", "name": "AuthnRequest and then an AssertionIDRequest"},
 {"depend": ["authn"], "id": "authn_endpoint_index", "descr": "", "name": ""},
 {"depend": ["authn"], "id": "authn-nid_transient", "descr": "AuthnRequest using HTTP-redirect",
  "name": "Basic SAML2 AuthnRequest, transient name ID"},
 {"depend": ["authn"], "id": "manage_nameid_nid-transient", "name": "Setting the SP provided ID by using ManageNameID"},

 {"id": "authn-artifact_nid-transient", "descr": "AuthnRequest using HTTP-redirect and artifact",
  "name": "SAML2 AuthnRequest expecting artifact response"},

 {"depend": ["authn"], "id": "authn_specified_endpoint", "descr": "", "name": ""},
 {"depend": ["authn"], "id": "authn-nid_unspecified", "descr": "AuthnRequest using HTTP-redirect",
  "name": "Basic SAML2 AuthnRequest, unspecified name ID format"},
 {"depend": ["authn"], "id": "log-in-out", "descr": "AuthnRequest using HTTP-redirect followed by a logout",
  "name": "Absolute basic SAML2 log in and out"},
 {"depend": ["authn"], "id": "authn-post", "descr": "AuthnRequest using HTTP-POST",
  "name": "Basic SAML2 AuthnRequest using HTTP POST"},
 {"depend": ["authn-post"], "id": "authn-post-transient", "descr": "AuthnRequest using HTTP-POST",
  "name": "AuthnRequest using HTTP POST expecting transient NameID"}]

[{'id': '1', 'children': ['2', '3', '4']},
 {'id': '2', 'children': ['5', '6']},
 {'id': '3'},
 {'id': '4', 'children': ['7']},
 {'id': '5'},
 {'id': '6'},
 {'id': '7'}]

[{'id': '1', 'children': ['2', '3', '4']},
 {'id': '2', 'children': ['5', '6']},
 {'id': '3'},
 {'id': '4', 'children': ['7']},
 {'id': '5'},
 {'id': '6'},
 {'id': '7'}]

[{"id": "Node", "children": [
    {"id": "Node2", "children": [
        {"id": "Node4", "children": []}]},
    {"id": "Node3", "children": []}]
 }]

