

//  Solo usuarios NO logueados

export const onlyPublic = (req, res, next) => {
    if (req.user) {
      return res.redirect("/current");
    }
    next();
  };
  
  //  Solo usuarios logueados
  
  export const onlyPrivate = (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login");
    }
    next();
  };
  