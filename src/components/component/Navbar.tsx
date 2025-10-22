import { UserCog } from "lucide-react";
import colors from "@/contants/colors";
import React from "react";

const Navbar=() => {
    return(
        <div
          className="flex justify-center items-center rounded-full p-3 fixed bottom-6 right-6 z-50 cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-2xl"
          style={{ 
            backgroundColor: colors.mindmesh.surface,
            border: `1px solid ${colors.mindmesh.border}`,
            boxShadow: `0 4px 12px ${colors.mindmesh.shadow}`
          }}
        >
          <UserCog 
            size={28} 
            style={{ 
              color: colors.mindmesh.info,
              transition: 'all 0.3s ease'
            }}
            className="group-hover:scale-110 group-hover:rotate-12"
          />
        </div>
    )
}

export default Navbar;