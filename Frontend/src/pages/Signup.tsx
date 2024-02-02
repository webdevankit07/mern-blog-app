import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

const Signup = () => {
    return (
        <div className="mt-20">
            <div className="flex flex-col max-w-5xl p-3 mx-auto md:flex-row md:items-center">
                {/* Left */}
                <div className="flex-1">
                    <Link to={"/"} className="text-4xl font-bold sm:text-xl dark:text-white">
                        <span className="px-2 py-1 mr-0.5 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Ankit's
                        </span>
                        Blog
                    </Link>
                    <p className="mt-5 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni sint velit a!
                    </p>
                </div>

                {/* Right */}
                <div className="flex-1">
                    <form className="flex flex-col gap-4">
                        <div>
                            <Label value="Your userName" />
                            <TextInput type="text" placeholder="Username" id="username" />
                        </div>
                        <div>
                            <Label value="Your email" />
                            <TextInput type="text" placeholder="name@company.com" id="email" />
                        </div>
                        <div>
                            <Label value="Your password" />
                            <TextInput type="text" placeholder="Password" id="password" />
                        </div>
                        <Button gradientDuoTone={"purpleToPink"} type="submit">
                            Sign Up
                        </Button>
                    </form>
                    <div className="flex gap-1 mt-5 text-sm">
                        <span>Have an account?</span>
                        <Link to={"/sign-in"} className="text-blue-600 underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
