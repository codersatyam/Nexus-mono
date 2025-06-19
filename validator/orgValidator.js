const verifyOrg = async (req, res, next) => {
    try {
        
        const orgId = req.headers['x-partner-id'];
        if (!orgId) {
            return res.status(400).send({ error: "Organization ID missing" });
        }
        const partnerKey = req.headers['x-partner-key']
        if (!partnerKey) {
            return res.status(400).send({ error: "Organization Key missing" });
        }
        const hasAccess = true//await authServicesInstance.verifyUserOrgAccess(user.id, orgId);
        if (!hasAccess) {
            return res.status(403).send({ error: "Invalid Organization" });
        }
        req.orgId = orgId;
        next();
    } catch (err) {
        handleError(err, res);
    }
};

module.exports = verifyOrg;