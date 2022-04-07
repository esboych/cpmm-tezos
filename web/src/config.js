import React, { useState } from 'react';

export function ConfigEnv(){
    //var env_val = "Test env value for config,js"
    var [env_val, setEnv_val] = useState("Test env value for config,js");
    return {env_val};
}