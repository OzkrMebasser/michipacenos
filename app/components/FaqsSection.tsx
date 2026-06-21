"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useIntersection } from "../lib/utils";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  photo: {
    src: string;
    alt: string;
    credit?: string;
  };
}

interface FaqGroup {
  title: string;
  icon: string;
  items: FaqItem[];
}

const WHATSAPP_NUMBER = "526121767890";

/* ──────────────────────────────────────────────
   1. ¿Cómo puedo ayudar a un gatito?
   ────────────────────────────────────────────── */
function HowToHelpAnswer() {
  const ways: { icon: string; title: string; desc: string }[] = [
    {
      icon: "✂️",
      title: "Esterilizando",
      desc: "Si no está en tus posibilidades adoptar un gato, puedes ayudar esterilizando a uno de la calle: Lo metes en una transportadora o jaba, haces una cita en nuestras campañas de esterilización a bajo costo, lo sueltas en el mismo lugar donde vive el gatito y así estás ayudando a reducir la reproducción de gatos callejeros, enfermos y sin hogar.",
    },
    {
      icon: "🏠",
      title: "Ser hogar temporal",
      desc: "Si encontraste algún gatito, ya sea pequeño o perdido, puedes resguardarlo y darle hogar temporal en lo que encuentras un adoptante o a sus dueños, evitarás que le pase algo al gatito cuidando de él y tendrá la posibilidad de encontrar un hogar. Así puedes cambiar la vida del gatito, evitando que viva en la calle bajo muchos riesgos.",
    },
    {
      icon: "🐾",
      title: "Adoptando a un gatito",
      desc: "Adoptar es cambiar la vida de un animalito, puedes acudir a las ferias de adopción, buscar en nuestra página de Facebook o adoptar algún gatito de la calle, ya sea pequeño o adulto, todos los gatos merecen ser cuidados y amados.",
    },
    {
      icon: "🤰",
      title: "Resguardar a una gata embarazada",
      desc: "Tristemente las gatitas embarazadas son muy vulnerables, puedes ayudarla dándole hogar temporal en tu patio, proporcionarle comida, agua y una cajita para que esté segura, tranquila y a salvo para tener a sus bebés. Después te puedes contactar con nosotros para llevar a los gatitos a una feria de adopción y buscar un hogar para ellos y la mamá. Así evitas que mueran o sufran en las calles.",
    },
    {
      icon: "🚑",
      title: "Ayudar a un gatito accidentado",
      desc: "Tristemente nos encontramos con muchos casos de gatitos enfermos, atropellados, perdidos, etc. Si es tu caso puedes ayudarlo llevándolo al veterinario o haciendo una publicación en redes sociales para pedir ayuda, si no está en tus posibilidades, tal vez alguien más que vea la publicación pueda ayudar. No hay que ser indiferentes en estas situaciones difíciles para ellos.",
    },
    {
      icon: "🍲",
      title: "Brindar agua y comida",
      desc: "Brinda agua y comida a un gatito de la calle, ellos necesitan estar hidratados y bien alimentados, para ellos es difícil encontrar agua limpia y en tiempo de calor pueden morir por deshidratación. Échales una patita y compárteles algua limpia y comida.",
    },
    {
      icon: "📣",
      title: "Comparte ésta información",
      desc: "Ahora que conoces algunas formas de ayudar, tal vez a alguien le sea muy útil, compártela con tus amigos, familiares, vecinos, etc. para sumarnos a ayudar a más gatitos y brindarles el bienestar que merecen estos hermosos seres vivos.",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {ways.map((w) => (
        <div key={w.title} className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <p className="font-bold text-orange-700 text-sm flex items-center gap-2 mb-1">
            <span>{w.icon}</span> {w.title}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{w.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   2. ¿Qué requisitos piden para adoptar un gato?
   ────────────────────────────────────────────── */
function AdoptionRequirementsAnswer() {
  const reqs: [string, string][] = [
    [
      "Gran responsabilidad",
      "UN gatito es una responsabilidad para toda la VIDA, recuerda que los gatos viven entre 10 a 16 años con cuidados adecuados.",
    ],
    [
      "Los gatos deben permanecer en casa",
      "Los gatitos se adaptan a su entorno y es de suma importancia que no salgan de casa ya que corren muchos riesgos, como perderse, ser atropellados, atacados por un perro, envenenados y mucho más. Para ello, debes adecuar bien tus ventanas, puertas, portones y bardas.",
    ],
    [
      "Adaptación con otras mascotas",
      "Es necesario tomar en cuenta a tus mascotas, ya que buscamos el bienestar de todos y si es conveniente tener un gato en casa. Tener mascotas agresivas pone en riesgo a un miembro más y no es posible la adopción. Toma su tiempo el adaptarse a su nuevo hogar, entorno y compañeros, para esto debes ser constante, tener paciencia y mucho amor.",
    ],
    [
      "Necesidades y cuidados",
      "Los gatos deben comer croquetas adecuadas a su edad, todos los gatos necesitan tener un arenero el cuál debe limpiarse diariamente, deben mantenerse activos, jugar diariamente con ellos para estimular su desarrollo y buen crecimiento. así como también revisión al médico, desparasitación y vacunas.",
    ],
    [
      "Seguimiento y esterilización",
      "Le daremos seguimiento a la adopción enviando un mensaje para ver cómo se encuentra el gato adoptado y al cumplir 5 meses, se agendará cita para la esterilización, ya que ésta es obligatoria.",
    ],
    [
      "Amor y cuidado",
      "Debes saber que los gatitos en adopción son rescatados y buscamos el bienestar de ellos, así como también reducir la población de gatos en la calle sufriendo. Brindarles mucho amor y cuidado.",
    ],
  ];

  return (
    <ol className="flex flex-col gap-3">
      {reqs.map(([title, desc], i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="min-w-[24px] h-[24px] rounded-full bg-[#0bbaf7]/15 text-[#08a4dd] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm text-gray-600">
            <strong className="text-gray-800">{title}.</strong> {desc}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ──────────────────────────────────────────────
   3. Ya tengo a mi gato en casa, ¿qué necesito preparar?
   ────────────────────────────────────────────── */
function FirstCatGuideAnswer() {
  const items: [string, string][] = [
    [
      "Bienvenida",
      "Prepara la casa para darle la bienvenida a tu gato. Crea las condiciones necesarias como puertas y ventanas para que esté seguro y a salvo.",
    ],
    [
      "Arena para gatos",
      "Otro elemento básico que necesitará tu gato desde el minuto uno es el arenero para hacer sus necesidades. Siempre debe estar limpio.",
    ],
    [
      "Michi cama",
      "Una de las cosas que tendrás que tener preparada será su camita, acomoda a tu gato en un lugar tranquilo y seguro para descansar.",
    ],
    [
      "Rascador",
      "Los gatos necesitan arañar por cuestiones fisiológicas, por tanto, si queremos conservar los muebles de nuestra casa sanos y salvos, ¡Consigue uno!",
    ],
    [
      "Alimentación",
      "Para que el gatito crezca sano es fundamental que su alimento sea de calidad y darle la cantidad adecuada para su tamaño y edad. Es imprescindible que tenga tres recipientes, uno para la comida seca, otro para la comida húmeda y otro para el agua, que debes cambiar a menudo para que esté fresca y limpia.",
    ],
    [
      "Juguetes",
      "Los gatos son animales muy curiosos e inquietos y necesitan jugar, así que para sus horas de actividad, ofrécele juguetes que le ayuden a desarrollar su instinto felino.",
    ],
    [
      "Higiene",
      "Los gatos son muy limpios. Se lavan directamente con su lengua, Nosotros podemos ayudarles a evitar que se le formen las indeseables bolas de pelo con cepillados.",
    ],
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map(([title, desc]) => (
        <div key={title} className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
          <p className="font-bold text-gray-800 text-sm mb-1">{title}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   4. ¿Qué es la esterilización?
   ────────────────────────────────────────────── */
function SterilizationInfoAnswer() {
  return (
    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
      <p className="text-sm text-gray-700 leading-relaxed">
        Consiste en extirpar las glándulas sexuales del gato o gata, con el fin de suprimir el celo (hembras) y evitar que se reproduzca.
      </p>
      <p className="text-sm text-gray-700 leading-relaxed mt-2">
        Ayuda a <strong className="text-teal-700">prevenir</strong> enfermedades, <strong className="text-teal-700">reducir</strong> el cambio de comportamiento, y{" "}
        <strong className="text-teal-700">evitar</strong> el abandono y las camadas no deseadas.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   5. Mitos sobre la esterilización
   ────────────────────────────────────────────── */
function SterilizationMythsAnswer() {
  const myths: [string, string][] = [
    ["Las hembras deben tener una camada antes de operar.", "Médicamente, no es necesario ni vital poner a una gata a criar."],
    ["Provoca que sean menos activos y que engorden.", "Esto se debe a la falta de ejercicio y/o mala alimentación."],
    ["Es mejor esterilizar solo a las hembras.", "Tanto hembras como machos deben ser esterilizados."],
    ['Se les quita su virilidad o lo "macho".', "Los gatos no tienen crisis de identidad sexual ni reacciones emocionales."],
    ["Al esterilizar, se les priva de la maternidad y paternidad.", "NO hay que humanizar el proceso físico de reproducción."],
    ["Pierden el instinto de cazadores.", "La esterilización NO cambia la conducta o inteligencia de los gatos."],
  ];

  return (
    <div className="flex flex-col gap-3">
      {myths.map(([myth, fact], i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-3">
          <p className="text-sm text-gray-400 line-through decoration-red-300">❌ {myth}</p>
          <p className="text-sm text-teal-700 font-medium mt-1">✅ {fact}</p>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   6. Encontré gatitos bebés
   ────────────────────────────────────────────── */
function FoundKittensAnswer() {
  const [tab, setTab] = useState(0);

  const scenarios: {
    label: string;
    evalua: string;
    advertencia?: string;
    ayuda: string[];
  }[] = [
    {
      label: "Recién nacidos",
      evalua:
        "Si los gatitos están relativamente limpios, tranquilos y en un lugar refugiados, es probable que la mamá ande cerca. Suelen salir a buscar alimento y regresan para amamantar y cuidar a sus bebés.",
      advertencia: "NO te lleves a los gatitos, pues necesitan a su mamá.",
      ayuda: [
        "Asegurarte de ver a la mamá volver.",
        "Darles o buscar un hogar temporal, tanto a la mamá como a los gatitos.",
        "Llevarlos a todos a evaluación médica.",
        "Si no encuentras hogar temporal, monitoréalos, deja comida y agua disponible para la mamá.",
        "Proporcionar un mejor refugio si crees que lo necesiten (una caja, una transportadora, etc).",
      ],
    },
    {
      label: "Posible abandono",
      evalua:
        "Si están sucios y llorando, en un lugar peligroso o inapropiado (como un bote de basura, una caja cerrada, en la calle), si la mamá no ha vuelto en más de 3-6 hrs, es probable que los hayan abandonado o que a la mamá le haya pasado algo en su búsqueda de alimento por lo que no pudo volver.",
      ayuda: [
        "Llevar a los gatitos al veterinario para que evalúen su estado de salud.",
        "Busca una gata nodriza (una gata que tenga bebés y esté lactando).",
        "Darles o buscar un hogar temporal con los cuidados que el veterinario te recomiende.",
      ],
    },
    {
      label: "Gatitos más grandes",
      evalua:
        "Si los gatitos son más independientes (comen y hacen del baño solos) y están sucios, solos y están expuestos al peligro (calles transitadas, perros agresivos, personas insensibles, etc.) y/o están aparentemente enfermos, probablemente necesiten ayuda.",
      ayuda: [
        "Llévalos a revisión médica.",
        "Dales o buscar un hogar temporal que pueda recibirlos.",
        "Aliméntalos con croquetas o comida húmeda para gatos bebés.",
        "Busca posibles adoptantes.",
        "Dale seguimiento a su adopción para que se cumpla un protocolo médico (desparasitación, vacunas y futura esterilización).",
      ],
    },
  ];

  const current = scenarios[tab];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setTab(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              tab === i ? "bg-[#ff3ca5] text-white" : "bg-pink-50 text-pink-600 hover:bg-pink-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs font-bold text-pink-500 uppercase tracking-wide mb-1">Evalúa</p>
        <p className="text-sm text-gray-600 leading-relaxed">{current.evalua}</p>
      </div>

      {current.advertencia && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl px-4 py-3">
          <p className="text-sm font-bold text-pink-700">{current.advertencia}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-bold text-pink-500 uppercase tracking-wide mb-1">Formas de ayudar</p>
        <ul className="flex flex-col gap-1.5">
          {current.ayuda.map((line, i) => (
            <li key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-pink-400">•</span>
              {line}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   7. Encontré una gata embarazada
   ────────────────────────────────────────────── */
function PregnantCatAnswer() {
  const tips = [
    "Proporciona un lugar seguro que la proteja a ella y a sus bebés del clima, depredadores y cualquier otro peligro.",
    "Si no puedes darle hogar temporal, ponle una caja grande o una jaba en un lugar seguro, le servirá de refugio.",
    "Dale comida y agua. Necesitará energía para dar a luz y amamantar a sus bebés.",
    "Si da a luz en tu patio cuida de ella. Si se siente segura no tendrá necesidad de mover a sus gatitos y podrás monitorear su crecimiento para su futura adopción.",
    "Después de 2 meses esteriliza a la gata. De esta forma la ayudas mucho.",
  ];

  return (
    <div className="flex flex-col gap-2">
      {tips.map((tip, i) => (
        <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
          {tip}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Componente de foto para cada pregunta
   ────────────────────────────────────────────── */
function FaqPhoto({ src, alt, credit }: { src: string; alt: string; credit?: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl mb-4 h-[200px] sm:h-[250px] lg:h-[300px] ">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Soft gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl" />
      {credit && (
        <span className="absolute bottom-2 right-3 text-white/60 text-[10px]">
          {credit}
        </span>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Contenido del FAQ
   ────────────────────────────────────────────── */
const FAQS: FaqGroup[] = [
  {
    title: "Cómo ayudar",
    icon: "🐾",
    items: [
      {
        question: "¿Cómo puedo ayudar a un gatito?",
        answer: <HowToHelpAnswer />,
        photo: {
          src: "https://images.pexels.com/photos/30577796/pexels-photo-30577796.jpeg",
          alt: "Persona ayudando a un gato callejero",
       
        },
      },
    ],
  },
  {
    title: "Adopción",
    icon: "🏠",
    items: [
      {
        question: "¿Qué requisitos piden para adoptar un gato?",
        answer: <AdoptionRequirementsAnswer />,
        photo: {
          src: "https://images.pexels.com/photos/8075319/pexels-photo-8075319.jpeg",
          alt: "Gato siendo adoptado en casa",
          
        },
      },
      {
        question: "Ya tengo a mi gato en casa, ¿qué necesito preparar?",
        answer: <FirstCatGuideAnswer />,
        photo: {
          src: "https://images.pexels.com/photos/35979734/pexels-photo-35979734.jpeg",
          alt: "Gatito descansando cómodo en casa",
        
        },
      },
    ],
  },
  {
    title: "Esterilización",
    icon: "✂️",
    items: [
      {
        question: "¿Qué es la esterilización y por qué es importante?",
        answer: <SterilizationInfoAnswer />,
        photo: {
          src: "https://images.pexels.com/photos/6816859/pexels-photo-6816859.jpeg",
          alt: "Veterinario revisando a un gato",
         
        },
      },
      {
        question: "He escuchado mitos sobre esterilizar a mi gato, ¿son ciertos?",
        answer: <SterilizationMythsAnswer />,
        photo: {
          src: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80&auto=format&fit=crop",
          alt: "Gato saludable y activo después de la esterilización",
        
        },
      },
    ],
  },
  {
    title: "Rescate y emergencias",
    icon: "🚨",
    items: [
      {
        question: "Encontré gatitos bebés, ¿qué hago?",
        answer: <FoundKittensAnswer />,
        photo: {
          src: "https://images.pexels.com/photos/26555929/pexels-photo-26555929.jpeg",
          alt: "Gatitos bebés recién nacidos",
        
        },
      },
      {
        question: "Encontré una gata embarazada, ¿qué hago?",
        answer: <PregnantCatAnswer />,
        photo: {
          src: "https://images.pexels.com/photos/14731747/pexels-photo-14731747.jpeg",
          alt: "Gata embarazada descansando",
      
        },
      },
    ],
  },
];

export default function FaqsSection() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { ref, visible } = useIntersection();

  return (
    <section className="py-12 bg-gray-50" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-4xl font-black text-[#ff3ca5] font-logo">
            Preguntas frecuentes
            <span className="ml-2">🐱</span>
          </h2>
          <p className="text-gray-600 text-md font-semibold mt-1">
            Resolvemos tus dudas antes de adoptar o ayudar a un michi
          </p>
        </div>

        <div
          className={`flex flex-col gap-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {FAQS.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{group.icon}</span>
                <h3 className="uppercase text-sm font-bold tracking-wider text-gray-700">{group.title}</h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {group.items.map((item, i) => {
                const key = `${group.title}-${i}`;
                const isOpen = openKey === key;
                return (
                  <div
                    key={key}
                    className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isOpen ? "border-[#ff3ca5]/40 shadow-md" : "border-gray-200 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                      <span className={`font-bold text-sm transition-colors ${isOpen ? "text-[#ff3ca5]" : "text-gray-800"}`}>
                        {item.question}
                      </span>
                      <FaChevronDown
                        className={`text-gray-400 text-xs transition-transform duration-300 flex-shrink-0 ml-4 ${
                          isOpen ? "rotate-180 text-[#ff3ca5]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
                        {/* Foto relacionada */}
                        <FaqPhoto
                          src={item.photo.src}
                          alt={item.photo.alt}
                          credit={item.photo.credit}
                        />
                        {/* Contenido original intacto */}
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* CTA final */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-bold text-gray-800 text-sm">¿Tienes otra duda?</p>
              <p className="text-sm text-gray-500">Escríbenos y te respondemos lo antes posible.</p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("¡Hola! Tengo una pregunta sobre los gatitos 🐱")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0"
            >
              💬 Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}