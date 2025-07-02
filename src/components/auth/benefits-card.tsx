import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star, Heart, Trophy, MapPin, Zap } from "lucide-react";

export function BenefitsCard() {
  const benefits = [
    {
      text: "Discover unique adventure experiences",
      icon: <MapPin className="h-4 w-4 text-black" strokeWidth={2.5} />,
      color: "bg-blue-300",
    },
    {
      text: "Connect with local tour guides",
      icon: <Heart className="h-4 w-4 text-black" strokeWidth={2.5} />,
      color: "bg-pink-300",
    },
    {
      text: "Get personalized travel recommendations",
      icon: <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />,
      color: "bg-purple-300",
    },
    {
      text: "Save your favorite destinations",
      icon: <Star className="h-4 w-4 text-black" strokeWidth={2.5} />,
      color: "bg-yellow-300",
    },
    {
      text: "Earn rewards for every booking",
      icon: <Trophy className="h-4 w-4 text-black" strokeWidth={2.5} />,
      color: "bg-green-300",
    },
  ];

  return (
    <Card className="border-3 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white h-full relative pt-0">
      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 border-3 border-black transform rotate-12 rounded-xl"></div>
      <motion.div
        className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 border-3 border-black rounded-xl"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      ></motion.div>

      <CardHeader className="border-b-3 border-black bg-blue-400 p-6 rounded-t-2xl relative">
        {/* Floating bubbles decoration */}
        <motion.div
          className="absolute right-8 top-5"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-green-300 rounded-full border border-black"></div>
        </motion.div>
        <motion.div
          className="absolute right-14 top-8"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, delay: 0.3, repeat: Infinity }}
        >
          <div className="w-4 h-4 bg-yellow-300 rounded-full border border-black"></div>
        </motion.div>
        <motion.div
          className="absolute right-20 top-6"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, delay: 0.5, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-blue-300 rounded-full border border-black"></div>
        </motion.div>

        <CardTitle className="text-xl font-black text-black uppercase">
          WHY JOIN UNPLAN?
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 relative">
        {/* Decorative Element */}
        <motion.div
          className="absolute -right-2 -top-2 w-6 h-6 bg-green-400 border-2 border-black rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        ></motion.div>

        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <motion.li
              key={index}
              className="flex items-start"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <motion.div
                className={`mr-3 h-8 w-8 ${benefit.color} border-2 border-black flex items-center justify-center flex-shrink-0 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {benefit.icon}
              </motion.div>
              <span className="font-bold text-black pt-1">{benefit.text}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="mt-8 p-4 bg-pink-300 border-3 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Decorative zigzag */}
          <motion.div
            className="absolute -top-4 -right-2 text-purple-500"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>

          <p className="font-black text-black text-sm">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>

        {/* Extra decorative elements */}
        <motion.div
          className="absolute bottom-2 left-3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-black"></div>
        </motion.div>
        <motion.div
          className="absolute bottom-3 left-8"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full border-2 border-black"></div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
