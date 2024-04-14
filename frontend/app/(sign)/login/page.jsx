"use client";
import { useState,useEffect } from "react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import signIn from "@/firebase/auth/signin";
import { useAuthContext } from "@/context/AuthContext";

const login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { result, error } = await signIn(formData.email, formData.password);

    if (error) {
        return console.log(error)
    }


    

    // else successful
    console.log(result)
    return router.push("/dashboard")
}


const { user } = useAuthContext()

useEffect(() => {
  if (user != null) router.push("/dashboard");
  console.log(user)
}, [user])

// if (user == null) return null

  return (
    <Card className="mx-auto max-w-sm mt-16">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Signup</CardTitle>
        <CardDescription>
          Please fill in the following details to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
              />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default login;
