module.exports = { 
    //view,update,add ve delete işlemleri için yetkileri tanımlama.
    privGroups:[
        {
            id:"USERS",
            name:"User Permissions",
        },
        {
            id:"ROLES",
            name:"Roles Permissions",
        },
        
        {
            id:"CATEGORIES",
            name:"Categories Permissions",
        },

        {
            id:"AUDITLOGS",
            name:"Auditlogs Permissions",
        },
    ],
    privileges:[
        {
            Key:"user_view",
            name:"User View",
            group:"USERS",
            description:"User view permission" 
        },
        {
            Key:"user_add",
            name:"User Add",
            group:"USERS",
            description:"User add permission" 
        },
        {
            Key:"user_update",
            name:"User update",
            group:"USERS",
            description:"User update permission" 
        },
        {
            Key:"user_delete",
            name:"User Delete",
            group:"USERS",
            description:"User Delete permission" 
        },
        {
            Key:"role_view",
            name:"Role View",
            group:"ROLES",
            description:"Role view permission" 
        },
        {
            Key:"role_add",
            name:"Role Add",
            group:"ROLES",
            description:"Role add permission" 
        },
        {
            Key:"role_update",
            name:"Role update",
            group:"ROLES",
            description:"Role update permission" 
        },
        {
            Key:"role_delete",
            name:"User Delete",
            group:"ROLES",
            description:"Role Delete permission" 
        },
        {
            Key:"category_view",
            name:"Category View",
            group:"CATEGORIES",
            description:"Category view permission" 
        },
        {
            Key:"category_add",
            name:"Category Add",
            group:"CATEGORIES",
            description:"Category add permission" 
        },
        {
            Key:"category_update",
            name:"Category update",
            group:"CATEGORIES",
            description:"Category update permission" 
        },
        {
            Key:"category_delete",
            name:"Category Delete",
            group:"CATEGORIES",
            description:"Category Delete permission" 
        },
        {
            Key:"category_export",
            name:"Category Export",
            group:"CATEGORIES",
            description:"Category Export permission" 
        },
    
        {
            Key:"auditlogs_view",
            name:"AuditLogs View",
            group:"AUDITLOGS",  
            description:"Auditlogs View" 
        },
    
    ]
};