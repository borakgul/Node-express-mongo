const mongoose = require('mongoose');
const RolePrivileges = require('./RolePrivileges');

const schema = mongoose.Schema(
    {
        role_name: { type: mongoose.SchemaTypes.String, required: true, unique: true },
        is_active: { type: Boolean, default: true },
        created_by: { type: mongoose.SchemaTypes.ObjectId },
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    }
);

class Roles extends mongoose.Model {
    // Custom remove method
    static async remove(query) {
        if (query._id) {
            console.log("Removing RolePrivileges with role_id:", query._id);

            try {
                const deleteResult = await RolePrivileges.deleteMany({ role_id: query._id });
                console.log("Privileges Deleted:", deleteResult.deletedCount);
            } catch (err) {
                console.error("Error deleting RolePrivileges:", err);
            }
        }

        // Role belgesini sil
        await super.deleteOne(query); // Modern ve önerilen yöntem
    }
}

schema.loadClass(Roles);
module.exports = mongoose.model('Roles', schema);
