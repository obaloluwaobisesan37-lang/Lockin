function StatCard({
title,
value,
description,
icon,
accent = "terracotta",
}) {
const accents = {
terracotta: {
icon: "bg-[#a65d43] text-white",
},
blue: {
icon: "bg-[#627b82] text-white",
},
gold: {
icon: "bg-[#b58b4b] text-white",
},
plum: {
icon: "bg-[#765b6b] text-white",
},
};

const style =
accents[accent] || accents.terracotta;

return ( <div className="glass card-hover rounded-3xl p-5"> <div className="relative flex items-start justify-between"> <div> <p className="text-xs font-bold uppercase tracking-wider text-[#918b82]">
{title} </p>

```
      <h3 className="mt-2 text-3xl font-black tracking-tight">
        {value}
      </h3>

      <p className="mt-2 text-xs text-[#716d66] dark:text-[#aaa69e]">
        {description}
      </p>
    </div>

    <div
      className={`rounded-2xl p-3 shadow-lg ${style.icon}`}
    >
      {icon}
    </div>
  </div>
</div>


);
}

export default StatCard;
